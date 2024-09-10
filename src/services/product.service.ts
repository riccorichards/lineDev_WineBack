import ProductRepository from "../database/product.repo";
import { ApiError, BadRequestError } from "../utils/errors/appError.utils";

class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async GetDiscountService() {
    const products = await this.repository.GetDiscountProducts();
    if (products.length < 1)
      throw new BadRequestError("No products with discount");

    return products;
  }

  async GetMostSoldProductsService(page: number) {
    const products = await this.repository.GetMostSoldProducts(page);
    if (!products) throw new ApiError();

    return products;
  }
}

export default ProductService;
