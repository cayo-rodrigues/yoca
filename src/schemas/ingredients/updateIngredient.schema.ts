import * as yup from "yup";
import { MAX_DECIMAL } from "../../utils";

const updateIngredientSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup.string().max(164, "name field has a max of 164 characters"),
        measure: yup.string().max(3, "measure field has a max of 3 characters"),
        amount: yup
          .number()
          .max(
            MAX_DECIMAL,
            "amount field can't have more than 10 digits in total (including decimal places)"
          )
          .positive("amount field can't be negative"),
        amountMax: yup
          .number()
          .max(
            MAX_DECIMAL,
            "amountMax field can't have more than 10 digits in total (including decimal places)"
          )
          .positive("amountMax field can't be negative")
          .required("Field amountMax is required when updating ingredient"),
        amountMin: yup
          .number()
          .max(
            MAX_DECIMAL,
            "amountMin field can't have more than 10 digits in total (including decimal places)"
          )
          .positive("amountMin field can't be negative")
          .lessThan(
            yup.ref("amountMax"),
            "amountMin should be less than amountMax"
          )
          .required("Field amountMin is required when updating ingredient"),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default updateIngredientSchema;
