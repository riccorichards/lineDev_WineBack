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
    return await CustomerModel.find().populate("address");
  }

  async FindCustomerByEmail(email: string) {
    return await CustomerModel.findOne({ email }).populate("address");
  }
}

export default CustomerRepository;
