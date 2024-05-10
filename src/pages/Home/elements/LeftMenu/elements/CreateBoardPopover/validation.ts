import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('👋 Board title is required')
    .test('length', 'Max 100 symbols', (value) => value.length <= 100),
});

export default schema;
