import * as yup from "yup";

const createProductSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup
          .string()
          .max(164, "name field has a max of 164 characters")
          .required("name field is required"),
        price: yup
          .number()
          .positive("price field must be a positive number")
          .required("price field is required"),
        calories: yup
          .number()
          .positive("calories field must be a positive number")
          .required("calories field is required"),
        ingredients: yup
          .array()
          .of(
            yup.object().shape({
              id: yup
                .string()
                .uuid("invalid ingredient id")
                .required("ingredient id field is required"),
              amount: yup
                .number()
                .positive("ingredient amount field must be a positive number")
                .required("ingredient amount field is required"),
            })
          )
          .required("array of ingredients is required"),
        categories: yup
          .array()
          .of(yup.string().uuid("invalid category id"))
          .required("array of categories is required"),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default createProductSchema;
