import * as yup from "yup";
import { MAX_DECIMAL, roundToTwo } from "../../utils";

const updateProductSchema = yup.object().shape({
  name: yup
    .string()
    .max(164, "Field name cannot be longer than 164 characters"),
  price: yup
    .number()
    .positive("Field price must be a positive number")
    .max(
      MAX_DECIMAL,
      "Field amount cannot be longer than 10 characters (including decimal places)"
    )
    .transform((value) => roundToTwo(value)),
  calories: yup
    .number()
    .positive("Field calories must be a positive number")
    .transform((value) => roundToTwo(value)),
  ingredients: yup.array().of(
    yup.object().shape({
      id: yup
        .string()
        .uuid("Field ingredientId must have a valid UUID")
        .required("Field ingredientId is required"),
      amount: yup
        .number()
        .positive("Field amount must be a positive number")
        .required("Field amount is required"),
    })
  ),
  categories: yup
    .array()
    .of(yup.string().uuid("Field categories must be a valid array of UUID"))
    .required("Field categories is required"),
});

export default updateProductSchema;
