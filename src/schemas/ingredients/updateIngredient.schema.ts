import * as yup from "yup";

const updateIngredientSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup.string().max(164, "name field has a max of 164 characters"),
        measure: yup.string().max(3, "measure field has a max of 3 characters"),
        amount: yup.number().positive("amount field can't be negative"),
        amountMax: yup
          .number()
          .positive("amountMax field can't be negative")
          .required("Field amountMax is required when updating ingredient"),
        amountMin: yup
          .number()
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
