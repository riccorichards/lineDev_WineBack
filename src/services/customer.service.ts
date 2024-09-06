import { boolean, string } from "zod";
import mongoose from "mongoose";
import {
  CreateCustomerSchemaType,
  UpdateCustomerSchemaType,
} from "../api/validation/customerVal/customer";
import CustomerRepository from "../database/customer.repo";
import {
  CartType,
  MongooseTypeObject,
  SessionInputType,
  WishlistType,
} from "../dto/dto.customer";
import {
  CreateAddressSchemaType,
  UpdateAddressSchemaType,
} from "../api/validation/customerVal/address";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../utils/errors/appError.utils";
import WineRepository from "../database/wine.repo";
import CocktailRepository from "../database/cocktail.repo";

class CustomerService {
  private repository: CustomerRepository;
  private wineRepo: WineRepository;
  private cocktailRepo: CocktailRepository;

  constructor() {
    this.repository = new CustomerRepository();
    this.wineRepo = new WineRepository();
    this.cocktailRepo = new CocktailRepository();
  }

  async SignUp(customerInput: CreateCustomerSchemaType) {
    const newCustomer = await this.repository.CreateCustomer(customerInput);
    if (!newCustomer) throw new BadRequestError("Customer creation failed");
    return newCustomer;
  }

  async SessionService(input: SessionInputType, userAgent: string) {
    const profile = await this.repository.FindCustomerByEmail(input.email);
    if (!profile) {
      throw new BadRequestError("Wrong credentials");
    }
    //if user was found we are checking its password
    const validPass = await profile.comparePass(input.password);
    if (!validPass) {
      throw new BadRequestError("Wrong credentials");
    }
    const newSession = await this.repository.CreateSession(
      profile._id as string,
      profile.isAdmin,
      userAgent
    );
    if (!newSession) throw new BadRequestError("Session creation failed");
    return newSession;
  }

  async CustomerAddress(userId: string, input: CreateAddressSchemaType) {
    const profile = await this.repository.FindCustomerById(userId);
    if (!profile) throw new NotFoundError("Customer was not found");

    const newAddress = await this.repository.AddAddress(input);
    if (newAddress) {
      profile.address = newAddress._id as MongooseTypeObject;
      await profile.save();
      return newAddress;
    }

    throw new BadRequestError();
  }

  async UpdateCustomerProfileService(
    userId: string,
    input: UpdateCustomerSchemaType
  ) {
    return await this.repository.UpdateCustomerProfile(userId, input);
  }

  async UpdateCustomerAddress(userId: string, input: UpdateAddressSchemaType) {
    const profile = await this.repository.FindCustomerById(userId);
    if (!profile) throw new NotFoundError("Customer was not found");
    const updatedAddress = await this.repository.UpdateCustomerAddress(
      profile.address as MongooseTypeObject,
      input
    );
    if (updatedAddress) {
      return updatedAddress;
    }
  }

  async GetCustomersService() {
    const customers = await this.repository.GetCustomers();
    if (!customers) throw new ApiError("Something went wrong.");
  }

  async GetCustomerByIdService(userId: string) {
    const customer = await this.repository.FindCustomerById(userId);
    if (!customer) throw new NotFoundError("Customer was not found");
    return customer;
  }

  async GetAllCustomerService() {
    return await this.repository.GetCustomers();
  }

  async AddItemInWishlistService(userId: string, input: WishlistType) {
    const profile = await this.repository.FindCustomerById(userId);

    if (!profile) throw new NotFoundError("Customer was not found");
    // define the wishlist based on WishlistType
    const wishlist = profile.wishlist as WishlistType[];
    if (wishlist.length < 1) {
      if (input.productType === "wine") {
        this.wineRepo.IncreaseWineByOne(input.productId);
      } else {
        this.cocktailRepo.IncreaseCocktailByOne(input.productId);
      }
      wishlist.push(input);
    } else {
      //checking the item is already exists or not
      const isExist = wishlist.some(
        (item) => item.productId.toString() === input.productId.toString()
      );
      if (isExist) {
        //if true, we need to remove it
        const index = wishlist.findIndex(
          (item) => item.productId === input.productId
        );
        wishlist.splice(index, 1);
      } else {
        if (input.productType === "wine") {
          this.wineRepo.IncreaseWineByOne(input.productId);
        } else {
          this.cocktailRepo.IncreaseCocktailByOne(input.productId);
        }
        wishlist.push(input);
      }
    }

    profile.wishlist = wishlist;
    const savedProfile = await profile.save();
    return savedProfile.wishlist;
  }

  async AddItemInCarttService(userId: string, input: CartType) {
    const profile = await this.repository.FindCustomerById(userId);

    if (!profile) throw new NotFoundError("Error with find User");

    const cart = profile.cart as CartType[];

    const index = cart.findIndex(
      (item) => item.productId.toString() === input.productId.toString()
    );

    //if index is eques -1 that means item is the cart it not exist, so we can just add it in the cart
    if (index !== -1) {
      //if item is already there, we need to define is it great than 0 or not, it not we need to update the unit of that specific item
      if (input.unit > 0) {
        cart[index].unit = input.unit;
      } else {
        //if the item's unit is equal 0 we need to remove it from the cart
        const index = cart.findIndex(
          (item) => item.productId.toString() === input.productId.toString()
        );
        cart.splice(index, 1);
      }
    } else {
      if (input.productType === "wine") {
        this.wineRepo.IncreaseCartWineByOne(input.productId);
      } else {
        this.cocktailRepo.IncreaseCartCocktailByOne(input.productId);
      }
      cart.push(input);
    }

    profile.cart = cart;

    const savedProfile = await profile.save();
    return savedProfile.cart;
  }
}

export default CustomerService;
