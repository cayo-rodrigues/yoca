import * as yup from "yup";
import { normalizeTextInput } from "../../utils";

const createCategorySchema = yup.object().shape({
  name: yup
    .string()
    .max(64, "Field name cannot be longer than 64 characters")
    .required("Field name is required")
    .transform((value) => normalizeTextInput(value)),
});

export default createCategorySchema;
