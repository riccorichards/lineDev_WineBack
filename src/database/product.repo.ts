import CocktailModel from "../models/cocktail";
import WineModel from "../models/wine";

class ProductRepository {
  async GetDiscountProducts(limit = 9) {
    const wines = await WineModel.find({ discount: { $gt: 0 } })
      .limit(limit)
      .select("titleTranslations price discount image");
    const coctails = await CocktailModel.find({ discount: { $gt: 0 } })
      .limit(limit)
      .select("titleTranslations price discount image");

    return [...wines, ...coctails];
  }

  async GetMostSoldProducts(limit = 3, page = 0) {
    const wines = await WineModel.find()
      .sort({ orderCourt: -1 })
      .select("titleTranslations price discount image orderCount")
      .skip(page * limit);
    const coctails = await CocktailModel.find()
      .sort({ orderCourt: -1 })
      .select("titleTranslations price discount image orderCount")
      .skip(page * limit);
    return [...wines, ...coctails]
      .slice(page * limit, 5)
      .sort((a, b) => b.orderCount - a.orderCount);
  }
}

export default ProductRepository;
