import * as yup from "yup";
import { MAX_DECIMAL, normalizeTextInput, roundToTwo } from "../../utils";

const updateIngredientSchema = yup.object().shape({
  name: yup
    .string()
    .max(164, "Field name cannot be longer than 164 characters")
    .transform((value) => normalizeTextInput(value)),
  measure: yup
    .string()
    .max(3, "Field measure cannot be longer than 3 characters")
    .transform((value) => normalizeTextInput(value)),
  amount: yup
    .number()
    .max(
      MAX_DECIMAL,
      "Field amount cannot be longer than 10 characters (including decimal places)"
    )
    .positive("Field amount must be a positive number")
    .transform((value) => roundToTwo(value)),
  amountMax: yup
    .number()
    .max(
      MAX_DECIMAL,
      "Field amountMax cannot be longer than 10 characters (including decimal places)"
    )
    .positive("Field amountMax must be a positive number")
    .required("Field amountMax is required")
    .transform((value) => roundToTwo(value)),

  amountMin: yup
    .number()
    .max(
      MAX_DECIMAL,
      "Field amountMin cannot be longer than 10 characters (including decimal places)"
    )
    .positive("Field amountMin must be a positive number")
    .lessThan(
      yup.ref("amountMax"),
      "Field amountMin should be smaller than field amountMax"
    )
    .required("Field amountMin is required")
    .transform((value) => roundToTwo(value)),
});

export default updateIngredientSchema;
