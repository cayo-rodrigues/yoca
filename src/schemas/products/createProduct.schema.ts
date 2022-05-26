import * as yup from "yup";
import { MAX_DECIMAL, normalizeTextInput, roundToTwo } from "../../utils";

const createProductSchema = yup.object().shape({
  name: yup
    .string()
    .max(164, "Field name cannot be longer than 164 characters")
    .required("Field name is required")
    .transform(normalizeTextInput),
  price: yup
    .number()
    .positive("Field price must be a positive number")
    .max(
      MAX_DECIMAL,
      "Field amount cannot be longer than 10 characters (including decimal places)"
    )
    .required("Field price is required")
    .transform(roundToTwo),
  calories: yup
    .number()
    .positive("Field calories must be a positive number")
    .required("Field calories is required")
    .transform(roundToTwo),
  ingredients: yup
    .array()
    .of(
      yup.object().shape({
        id: yup
          .string()
          .uuid("Field ingredient id must have a valid UUID")
          .required("Field ingredient id is required"),
        amount: yup
          .number()
          .positive("Field amount must be a positive number")
          .required("Field amount is required"),
      })
    )
    .required("Field ingredients is required"),
  categories: yup
    .array()
    .of(yup.string().uuid("Field categories must be a valid array of UUID"))
    .required("Field categories is required"),
});

export default createProductSchema;
