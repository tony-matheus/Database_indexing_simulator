export const formatObjectToArray = (data) =>
  data && Object.keys(data).map(key=> ({ key, value: data[key] }));
  

  