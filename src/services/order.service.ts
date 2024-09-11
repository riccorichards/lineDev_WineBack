import { MongooseTypeObject } from "./../dto/dto.customer";
import { OrderType, UpdateOrderType } from "../api/validation/order";
import CustomerRepository from "../database/customer.repo";
import OrderRepository from "../database/order.repo";
import { ApiError, BadRequestError } from "../utils/errors/appError.utils";

class OrderService {
  private customerRepo: CustomerRepository;
  private orderRepo: OrderRepository;

  constructor() {
    this.customerRepo = new CustomerRepository();
    this.orderRepo = new OrderRepository();
  }

  async CreateOrderService(userId: string, order: OrderType) {
    const profile = await this.customerRepo.FindCustomerById(userId);

    if (!profile) throw new BadRequestError("User was not found.");
    const { cart, username, email, phone } = profile;
    const orderCreated = await this.orderRepo.CreateOrder(
      order,
      userId,
      username,
      email,
      phone
    );

    if (!orderCreated)
      throw new BadRequestError("Error during creation of order.");

    const orderItems = cart.map((item) => {
      return {
        title: item.title,
        price: item.price,
        unit: item.unit,
        image: item.image,
      };
    });

    const createOrderItems = await this.orderRepo.CreateOrderItems(orderItems);
    if (!createOrderItems)
      throw new BadRequestError("Error during create order items.");
    const itemIds = createOrderItems.map(
      (item) => item._id as MongooseTypeObject
    );
    orderCreated.orderItems.push(...itemIds);
    const savedOrder = await orderCreated.save();
    if (!savedOrder) throw new ApiError();
    profile.cart = [];
    await profile.save();
    return savedOrder;
  }

  async GetCustomerOrdersService(userId: string) {
    return await this.orderRepo.GetCustomerOrders(userId);
  }

  async GetAllOrdersService() {
    return await this.orderRepo.GetAllOrders();
  }

  async GetLengthOfOrdersService() {
    return await this.orderRepo.GetLengthOfOrders();
  }

  async UpdateOrderStatusService(
    orderId: string,
    input: "Complete" | "Reject"
  ) {
    const order = await this.orderRepo.FindOrderById(orderId);
    if (!order) throw new ApiError("Order not found");
    if (order.deliveryStatus === "Complete")
      throw new ApiError("Order is already complete");
    if (order.deliveryStatus === "Reject")
      throw new ApiError("Order is already reject");
    order.deliveryStatus = input;
    return await order.save();
  }

  async GetTotalIncomingService() {
    return await this.orderRepo.GetTotalIncoming();
  }

  async GetTotalSpendByUserService(customerId: string) {
    return await this.orderRepo.GetTotalSpendForCustomer(customerId);
  }
}

export default OrderService;
