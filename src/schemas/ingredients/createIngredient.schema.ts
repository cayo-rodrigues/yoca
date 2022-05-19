import * as yup from "yup";

import { roundToTwo } from "../../utils";

const createIngredientSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup
          .string()
          .max(164, "name field has a max of 164 characters")
          .required("name field is required")
          .transform((value, originalValue) =>
            originalValue.toLowerCase().trim()
          ),
        measure: yup
          .string()
          .max(3, "measure field has a max of 3 characters")
          .required("measure field is required")
          .transform((value, originalValue) =>
            originalValue.toLowerCase().trim()
          ),
        amount: yup
          .number()
          .positive("amount field can't be negative")
          .required("amount field is required")
          .transform((value, originalValue) => roundToTwo(originalValue)),
        amountMax: yup
          .number()
          .positive("amountMax field can't be negative")
          .required("amountMax field is required")
          .transform((value, originalValue) => roundToTwo(originalValue)),
        amountMin: yup
          .number()
          .positive("amountMin field can't be negative")
          .required("amountMin field is required")
          .lessThan(
            yup.ref("amountMax"),
            "amountMin should be less than amountMax"
          )
          .transform((value, originalValue: number) =>
            roundToTwo(originalValue)
          ),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default createIngredientSchema;
