import AppDataSource from "../../data-source";
import { IList } from "../../interfaces/List.interface";
import Category from "../../models/Category.model";
import { getUrl } from "../../utils";

class ListCategoriesService {
  static async execute({ per_page, page }: IList): Promise<any> {
    const categoryRepository = AppDataSource.getRepository(Category);

    if (!per_page) {
      per_page = 20;
    }

    if (!page) {
      page = 1;
    }

    const count = await categoryRepository.count();

    const pages = Math.ceil(count / per_page);

    const prev =
      page <= 1
        ? null
        : `${getUrl()}/categories?per_page=${per_page}&page=${page - 1}`;

    const next =
      page >= pages
        ? null
        : `${getUrl()}/categories?per_page=${per_page}&page=${page + 1}`;

    const categories = await categoryRepository.find({
      skip: per_page * (page - 1),
      take: per_page,
    });

    return {
      results: categories,
      info: {
        count,
        pages,
        next,
        prev,
      },
    };
  }
}

export default ListCategoriesService;
