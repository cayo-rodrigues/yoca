import * as yup from "yup";
import { MAX_DECIMAL } from "../../utils";

const updateProductSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup.string().max(164, "name field has a max of 164 characters"),
        price: yup
          .number()
          .max(
            MAX_DECIMAL,
            "price field can't have more than 10 digits in total (including decimal places)"
          )
          .positive("price field must be a positive number"),
        calories: yup
          .number()
          .positive("calories field must be a positive number"),
        ingredients: yup.array().of(
          yup.object().shape({
            id: yup
              .string()
              .uuid("invalid ingredient id")
              .required("ingredient id field is required"),
            amount: yup
              .number()
              .positive("ingredient amount field must be a positive number")
              .required("ingredient id field is required"),
          })
        ),
        categories: yup.array().of(yup.string().uuid("invalid category id")),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default updateProductSchema;
