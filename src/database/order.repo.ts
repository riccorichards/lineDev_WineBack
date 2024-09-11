import { OrderType, UpdateOrderType } from "../api/validation/order";
import OrderModel from "../models/order";
import OrderItemModel from "../models/orderItem";
import { ApiError } from "../utils/errors/appError.utils";

class OrderRepository {
  async CreateOrder(
    order: OrderType,
    userId: string,
    username: string,
    email: string,
    phone: string
  ) {
    const newOrder = {
      ...order,
      customerId: userId,
      username,
      email,
      phone,
      paymentStatus: "Complete",
      deliveryStatus: "Pending",
      orderItems: [],
    };
    return await OrderModel.create(newOrder);
  }

  async CreateOrderItems(
    orderItems: Array<{
      title: string;
      price: number;
      unit: number;
      image: string;
    }>
  ) {
    return await OrderItemModel.insertMany(orderItems, { ordered: true });
  }

  async GetCustomerOrders(customerId: string) {
    return await OrderModel.find({ customerId }).populate({
      path: "orderItems",
      model: "OrderItems",
    });
  }

  async FindOrderById(orderId: string) {
    try {
      return await OrderModel.findById(orderId);
    } catch (error: any) {
      throw new ApiError(error.message);
    }
  }

  async GetAllOrders() {
    return await OrderModel.find().populate({
      path: "orderItems",
      model: "OrderItems",
    });
  }

  async GetLengthOfOrders() {
    try {
      return (await OrderModel.find()).length;
    } catch (error: any) {
      throw new ApiError(error.message);
    }
  }

  async GetTotalIncoming() {
    try {
      const result = await OrderModel.aggregate([
        {
          $group: {
            _id: null,
            totalIncoming: { $sum: "$totalAmount" },
          },
        },
      ]);
      return result.length > 0 ? result[0].totalIncoming : 0;
    } catch (error: any) {
      throw new ApiError(error.message);
    }
  }

  async GetTotalSpendForCustomer(customerId: string) {
    try {
      const result = await OrderModel.aggregate([
        {
          $match: { customerId },
        },
        {
          $group: {
            _id: customerId,
            totalSpend: { $sum: "$totalAmount" },
          },
        },
      ]);
      return result.length > 0 ? result[0].totalSpend : 0;
    } catch (error: any) {
      throw new ApiError(error.message);
    }
  }
}

export default OrderRepository;
