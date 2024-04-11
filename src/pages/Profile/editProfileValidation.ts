import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required().min(2).max(50),
  lastName: yup.string().required().min(2).max(50),
});

export default schema;
