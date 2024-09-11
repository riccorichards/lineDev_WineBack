import { Application, NextFunction, Request, Response } from "express";
import CustomerService from "../services/customer.service";
import { validateIncomingData } from "./validation/validateResources";
import {
  CreateCustomerSchema,
  CreateCustomerSchemaType,
  UpdateCustomerSchema,
  UpdateCustomerSchemaType,
} from "./validation/customerVal/customer";
import { CreateSessionSchema } from "./validation/customerVal/session";
import { omit } from "lodash";
import {
  CreateAddressSchema,
  CreateAddressSchemaType,
  UpdateAddressSchema,
  UpdateAddressSchemaType,
} from "./validation/customerVal/address";
import { signWithJWT } from "../utils/jwt.utils";
import { deserializeUser } from "./deserializeUser";
import CategoryService from "../services/category.service";
import {
  CategoryParamsSchema,
  CategoryParamsType,
  CreateCategorySchema,
  CreateCategorySchemaType,
  UpdateCategorySchema,
  UpdateCategorySchemaType,
} from "./validation/category";
import {
  CreateWineInput,
  CreateWineSchema,
  filterQueryInput,
  PopularProductSchema,
  PopularQueryInput,
  PriceRangeQueryInput,
  PriceRangeQuerySchema,
  ProductsStatsInput,
  ProductsStatsSchema,
  RelativeProductsInput,
  RelativeProductsSchema,
  SearchQueryInput,
  SearchQuerySchema,
  UpdateWineSchema,
  WineParamsInput,
  WineParamsSchema,
} from "./validation/wine";

import FeedbackService from "../services/feedback.service";
import WineService from "../services/wine.service";
import {
  CocktailParamsInput,
  CocktailParamsSchema,
  CreateCocktailSchema,
  UpdateCocktailSchema,
} from "./validation/cocktail";
import CocktailService from "../services/cocktail.service";
import {
  BlogParams,
  BlogParamsInput,
  CreateBlogInput,
  CreateBlogSchema,
  UpdateBlogInput,
  UpdateBlogSchema,
} from "./validation/blog";
import BlogService from "../services/blog.service";
import {
  CommentParamsInput,
  CommentParamsSchema,
  CreateCommentInput,
  CreateCommentSchema,
  UpdateCommentInput,
  UpdateCommentSchema,
} from "./validation/comment";
import CommentService from "../services/comment.service";
import {
  CreateFeedbackSchema,
  CreateFeedbackSchemaType,
  FeedbackParamsSchema,
  FeedbackParamsType,
} from "./validation/feedback";
import { Types } from "mongoose";
import { requireRole } from "./requestUser";
import ProductService from "../services/product.service";
import { OrderSchema, OrderType, UpdateOrderType } from "./validation/order";
import OrderService from "../services/order.service";

const api = (app: Application) => {
  const service = new CustomerService();
  const CatService = new CategoryService();
  const wineService = new WineService();
  const cocktailService = new CocktailService();
  const feedbackService = new FeedbackService();
  const blogService = new BlogService();
  const commentService = new CommentService();
  const productService = new ProductService();
  const orderService = new OrderService();

  app.post(
    "/signup",
    validateIncomingData(CreateCustomerSchema), // validation process, first then we start processing with incoming data we need check it
    async (
      req: Request<{}, {}, CreateCustomerSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const newCustomer = await service.SignUp(req.body);
        if (!newCustomer)
          return res.status(404).json({ err: "Error with Sign Up" });
        return res.status(201).json(omit(newCustomer.toJSON(), "password"));
      } catch (error) {
        next(error);
      }
    }
  );

  //create session for user
  app.post(
    "/login",
    validateIncomingData(CreateSessionSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const newSession = await service.SessionService(
          req.body,
          req.get("user-agent") || ""
        );

        if (!newSession)
          return res.status(404).json({ err: "Wrong credentials" });

        //create an access token
        const accessToken = signWithJWT(
          {
            user: newSession.user,
            admin: newSession.admin,
            session: newSession._id,
          },
          { expiresIn: 30 * 60 } // 30 min
        );

        //create a refresh token
        const refreshToken = signWithJWT(
          {
            user: newSession.user,
            admin: newSession.admin,
            session: newSession._id,
          },
          { expiresIn: 24 * 60 * 60 } //in one day
        );

        return res.status(201).json({ accessToken, refreshToken });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/find-customer",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        const user = await service.GetCustomerByIdService(userId);
        if (!user)
          return res.status(404).json({ err: "Error with fetching user" });

        return res.status(201).json(omit(user.toJSON(), "password"));
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.get(
    "/customers",
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await service.GetAllCustomerService();
        if (!result)
          return res.status(404).json({ err: "Error with fetching user" });

        return res.status(201).json(result);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.delete(
    "/log_out",
    deserializeUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res.status(201).json(null);
      } catch (error: any) {
        next(error);
      }
    }
  );

  // add address
  app.post(
    "/address",
    validateIncomingData(CreateAddressSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<{}, {}, CreateAddressSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = res.locals.user.user;
        const address = await service.CustomerAddress(userId, req.body);
        if (!address)
          return res
            .status(404)
            .json({ err: "Error with adding address information" });
        return res.status(201).json(address);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.put(
    "/update-address",
    validateIncomingData(UpdateAddressSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<{}, {}, UpdateAddressSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = res.locals.user;
        const updatedAddress = await service.UpdateCustomerAddress(
          userId,
          req.body
        );
        if (!updatedAddress)
          return res.status(404).json({ err: "Error with updating process" });
        return res.status(201).json(updatedAddress);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.put(
    "/update-profile",
    validateIncomingData(UpdateCustomerSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<{}, {}, UpdateCustomerSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        //take user id from access token
        const userId = res.locals.user.user;
        const updatedAddress = await service.UpdateCustomerProfileService(
          userId,
          req.body
        );
        if (!updatedAddress)
          return res.status(404).json({ err: "Error with updating process" });
        return res.status(201).json(updatedAddress);
      } catch (error: any) {
        next(error);
      }
    }
  );

  app.post(
    "/wishlist-item",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(201)
          .json(await service.AddItemInWishlistService(userId, req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/wishlist-item",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        return res.status(201).json(await service.GetWishListInfo(userId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/cart-item",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(201)
          .json(await service.AddItemInCarttService(userId, req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/cart-item",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        return res.status(201).json(await service.GetCartInfo(userId));
      } catch (error) {
        next(error);
      }
    }
  );

  // category section
  app.get(
    "/categories",
    // [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(200).json(await CatService.GetAllCategoriesService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/wine-categories",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(200)
          .json(await CatService.GetAllWineCategoriesService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/cocktail-categories",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(200)
          .json(await CatService.GetAllCocktailCategoriesService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/category/:catId",
    validateIncomingData(CategoryParamsSchema),
    async (
      req: Request<CategoryParamsType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(
            await CatService.GetCategoryService(
              new Types.ObjectId(req.params.catId)
            )
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/category",
    validateIncomingData(CreateCategorySchema),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<{}, {}, CreateCategorySchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(await CatService.CreateCategoryService(req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/update-category/:catId",
    validateIncomingData(UpdateCategorySchema),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<CategoryParamsType, {}, UpdateCategorySchemaType["body"]>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res.status(200).json(
          await CatService.UpdateCategoryService({
            catId: req.params.catId,
            titleTranslations: req.body.titleTranslations,
          })
        );
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/delete-category/:catId",
    validateIncomingData(CategoryParamsSchema),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<CategoryParamsType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(await CatService.DeleteCategoryService(req.params.catId));
      } catch (error) {
        next(error);
      }
    }
  );

  // wine product section
  app.post(
    "/wine",
    validateIncomingData(CreateWineSchema),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<{}, {}, CreateWineInput>,
      res: Response,
      next: NextFunction
    ) => {
      const {} = req.body;
      try {
        return res
          .status(200)
          .json(await wineService.CreateWineService(req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/update-wine/:wineId",
    validateIncomingData(UpdateWineSchema),
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      const { wineId } = req.params;
      try {
        return res
          .status(200)
          .json(
            await wineService.UpdateWineService(
              new Types.ObjectId(wineId),
              req.body
            )
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("/wines", async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(await wineService.AllWinesService());
    } catch (error) {
      next(error);
    }
  });

  app.get(
    "/wine/:wineId",
    validateIncomingData(WineParamsSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(200)
          .json(await wineService.GetWineService(req.params.wineId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/search-byName",
    validateIncomingData(SearchQuerySchema),
    async (
      req: Request<{}, {}, {}, SearchQueryInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { lang, title, flag } = req.query;
        const result =
          flag === "wine"
            ? await wineService.SearchByTitleService(lang, title)
            : await cocktailService.SearchByTitleService(lang, title);
        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/delete-wine/:wineId",
    validateIncomingData(WineParamsSchema),
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      const { wineId } = req.params;
      try {
        return res
          .status(200)
          .json(await wineService.DeleteWineService(wineId));
      } catch (error) {
        next(error);
      }
    }
  );

  // cocktails section
  app.post(
    "/cocktail",
    validateIncomingData(CreateCocktailSchema),
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(200)
          .json(await cocktailService.CreateCocktailService(req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/update-cocktail/:cocktailId",
    validateIncomingData(UpdateCocktailSchema),
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      const { cocktailId } = req.params;
      try {
        return res
          .status(200)
          .json(
            await cocktailService.UpdateCocktailService(
              new Types.ObjectId(cocktailId),
              req.body
            )
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/cocktails",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(200)
          .json(await cocktailService.AllCocktailsService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/cocktail/:cocktailId",
    validateIncomingData(CocktailParamsSchema),
    async (
      req: Request<CocktailParamsInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(
            await cocktailService.GetCocktailService(
              new Types.ObjectId(req.params.cocktailId)
            )
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/delete-cocktail/:cocktailId",
    validateIncomingData(CocktailParamsSchema),
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      const { cocktailId } = req.params;
      try {
        return res
          .status(200)
          .json(await cocktailService.DeleteCocktailService(cocktailId));
      } catch (error) {
        next(error);
      }
    }
  );

  // feedbak section

  app.post(
    "/feedback",
    validateIncomingData(CreateFeedbackSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<{}, {}, CreateFeedbackSchemaType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(200)
          .json(await feedbackService.CreateFeedbackService(userId, req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/feedback",
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(200)
          .json(await feedbackService.GetAllFeedbackService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/customer-feedback",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(200)
          .json(await feedbackService.GetCustomerFeedbackService(userId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/customer-feedback-length",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(200)
          .json(await feedbackService.GetCustomerFeedbackService(userId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/delete-feedback/:feedId",
    validateIncomingData(FeedbackParamsSchema),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<FeedbackParamsType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(await feedbackService.RemoveFeedbackService(req.params.feedId));
      } catch (error) {
        next(error);
      }
    }
  );

  // blog section

  app.post(
    "/blog",
    validateIncomingData(CreateBlogSchema),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<{}, {}, CreateBlogInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(await blogService.CreateBlogService(req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("/blogs", async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(await blogService.AllBlogsService());
    } catch (error) {
      next(error);
    }
  });

  app.get(
    "/blog/:blogId",
    validateIncomingData(BlogParams),
    async (
      req: Request<BlogParamsInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(await blogService.GetBlogService(req.params.blogId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/update-blog/:blogId",
    validateIncomingData(UpdateBlogSchema),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<UpdateBlogInput["params"], {}, UpdateBlogInput["body"]>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(
            await blogService.UpdateBlogService(req.params.blogId, req.body)
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/related-blogs/:blogId",
    validateIncomingData(BlogParams),
    async (
      req: Request<BlogParamsInput, {}, {}>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(await blogService.GetRelatedBlogService(req.params.blogId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/delete-blog/:blogId",
    validateIncomingData(BlogParams),
    [deserializeUser, requireRole(true)],
    async (
      req: Request<BlogParamsInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(await blogService.DeleteBlogService(req.params.blogId));
      } catch (error) {
        next(error);
      }
    }
  );

  // comment sections

  app.post(
    "/comment",
    validateIncomingData(CreateCommentSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<{}, {}, CreateCommentInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(200)
          .json(await commentService.CreateCommentService(userId, req.body));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/comment",
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(200).json(await commentService.AllCommentsService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/update-comment/:commentId",
    validateIncomingData(UpdateCommentSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<
        UpdateCommentInput["params"],
        {},
        UpdateCommentInput["body"]
      >,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(
            await commentService.UpdateCommentService(
              req.params.commentId,
              req.body
            )
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/delete-comment/:commentId",
    validateIncomingData(CommentParamsSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<CommentParamsInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res
          .status(200)
          .json(
            await commentService.DeleteCommentService(req.params.commentId)
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/discount",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res.status(200).json(await productService.GetDiscountService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/wine-filters",
    async (
      req: Request<{}, {}, {}, filterQueryInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { target } = req.query;
        return res.status(200).json(await wineService.GetWineFilters(target));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/price-range",
    validateIncomingData(PriceRangeQuerySchema),
    async (
      req: Request<{}, {}, {}, PriceRangeQueryInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { minPrice, maxPrice, isWine } = req.query;

        const min = Number(minPrice);
        const max = Number(maxPrice);

        const result =
          isWine === "true"
            ? await wineService.GetWinePriceRangeService(min, max)
            : await cocktailService.GetCocktailPriceRangeService(min, max);

        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/popular-products",
    validateIncomingData(PopularProductSchema),
    async (
      req: Request<{}, {}, {}, PopularQueryInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { page, isWine } = req.query;
        return res
          .status(200)
          .json(
            isWine === "true"
              ? await wineService.GetPopularWinesService(Number(page))
              : await cocktailService.GetPopularCocktailsService(Number(page))
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/most-sold-products",
    async (
      req: Request<{}, {}, {}, { page: string }>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { page } = req.query;
        return res
          .status(200)
          .json(await productService.GetMostSoldProductsService(Number(page)));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/product-stats/:productId",
    validateIncomingData(ProductsStatsSchema),
    async (
      req: Request<
        ProductsStatsInput["params"],
        {},
        {},
        ProductsStatsInput["query"]
      >,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { productId } = req.params;
        const { isWine } = req.query;

        return res
          .status(200)
          .json(
            isWine === "true"
              ? await wineService.GetWineStatsService(
                  new Types.ObjectId(productId)
                )
              : await cocktailService.GetCocktailStatsService(
                  new Types.ObjectId(productId)
                )
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/relative-products/:categoryId",
    validateIncomingData(RelativeProductsSchema),
    async (
      req: Request<
        RelativeProductsInput["params"],
        {},
        {},
        RelativeProductsInput["query"]
      >,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { isWine, page } = req.query;
        const { categoryId } = req.params;
        return res
          .status(200)
          .json(
            isWine === "true"
              ? await wineService.GetRelativeWinesService(
                  new Types.ObjectId(categoryId),
                  Number(page)
                )
              : await cocktailService.GetRelativeCocktailsService(
                  new Types.ObjectId(categoryId),
                  Number(page)
                )
          );
      } catch (error) {
        next(error);
      }
    }
  );

  // create order

  app.post(
    "/create-order",
    validateIncomingData(OrderSchema),
    [deserializeUser, requireRole(false)],
    async (
      req: Request<{}, {}, OrderType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = res.locals.user.user;
        const { userAddress, totalAmount, note } = req.body;
        return res.status(201).json(
          await orderService.CreateOrderService(userId, {
            userAddress,
            totalAmount,
            note,
          })
        );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/customer-orders",
    [deserializeUser, requireRole(false)],
    async (
      req: Request<{}, {}, OrderType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(201)
          .json(await orderService.GetCustomerOrdersService(userId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/orders",
    [deserializeUser, requireRole(true)],
    async (
      req: Request<{}, {}, OrderType>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        return res.status(201).json(await orderService.GetAllOrdersService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/update-order/:orderId",
    [deserializeUser, requireRole(true)],
    async (
      req: Request<UpdateOrderType["params"], {}, UpdateOrderType["body"]>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { orderId } = req.params;
        const { deliveryStatus } = req.body;
        return res
          .status(201)
          .json(
            await orderService.UpdateOrderStatusService(orderId, deliveryStatus)
          );
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/total-spend",
    [deserializeUser, requireRole(false)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.user.user;
        return res
          .status(201)
          .json(await orderService.GetTotalSpendByUserService(userId));
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/total-incoming",
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(201)
          .json(await orderService.GetTotalIncomingService());
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/lengthOf-orders",
    [deserializeUser, requireRole(true)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        return res
          .status(201)
          .json(await orderService.GetLengthOfOrdersService());
      } catch (error) {
        next(error);
      }
    }
  );
};

export default api;
