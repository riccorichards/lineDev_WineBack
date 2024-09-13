import {
  CreateCustomerSchemaType,
  UpdateCustomerSchemaType,
} from "../api/validation/customerVal/customer";
import CustomerModel from "../models/customer";
import AddressModel from "../models/address";
import SessionModel from "../models/session";
import {
  CreateAddressSchemaType,
  UpdateAddressSchemaType,
} from "../api/validation/customerVal/address";
import { MongooseTypeObject } from "../dto/dto.customer";
import { periodSwitcher } from "../utils/periodSwitcher";
import OrderItemModel from "../models/orderItem";

class CustomerRepository {
  // create customer in db
  async CreateCustomer(input: CreateCustomerSchemaType) {
    return await CustomerModel.create({
      ...input,
      address: null,
      wishlist: [],
      feedback: [],
      cart: [],
      order: [],
    });
  }

  async CreateSession(userId: string, admin: boolean, userAgent: string) {
    return await SessionModel.create({
      user: userId,
      valid: true,
      admin,
      userAgent,
    });
  }

  async AddAddress(input: CreateAddressSchemaType) {
    return (await AddressModel.create(input)).save();
  }

  async UpdateCustomerProfile(userId: string, input: UpdateCustomerSchemaType) {
    return await CustomerModel.findByIdAndUpdate(userId, input, { new: true });
  }

  async UpdateCustomerAddress(
    addressId: MongooseTypeObject,
    input: UpdateAddressSchemaType
  ) {
    return await AddressModel.findByIdAndUpdate(addressId, input, {
      new: true,
    });
  }

  async FindCustomerById(id: string) {
    return await CustomerModel.findById(id).populate("address");
  }

  async GetCustomers() {
    return await CustomerModel.find()
      .populate("address")
      .select("username email image address phone");
  }

  async FindCustomerByEmail(email: string) {
    return await CustomerModel.findOne({ email }).populate("address");
  }

  async ActiveCustomers(inPeriod: string) {
    const { startDate, now } = periodSwitcher(inPeriod);
    return await SessionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSessions: 1,
        },
      },
    ]);
  }

  async GetCustomerFavoriteProduct(customerId: string) {
    return await OrderItemModel.aggregate([
      {
        $match: { customerId: customerId },
      },
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 },
          productDetails: { $first: "$$ROOT" }, // Get the first document for details (e.g., title, price)
        },
      },
      {
        $sort: { count: -1 }, // Sort by the count in descending order
      },
      {
        $limit: 3, // Limit to the most frequently ordered product
      },
      {
        $project: {
          _id: 0,
          count: 1, // Include the count
          productDetails: 1, // Include product details
        },
      },
    ]);
  }
}

export default CustomerRepository;
