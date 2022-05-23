import * as yup from "yup";

const updateProductSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup.string().max(164, "name field has a max of 164 characters"),
        price: yup.number().positive("price field must be a positive number"),
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
