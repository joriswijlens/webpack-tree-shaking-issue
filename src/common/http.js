const objectToQuery = (object) => {
  const query = []
  for (const property in object) {
    const propertyValue = object[property]
    if (propertyValue !== undefined && propertyValue !== null) {
      query.push({ name: property, value: propertyValue })
    }
  }
  return query
}

const queryParams = (query) => {
  if (query && query.length > 0) {
    const array = []
    query.forEach((param) => {
      array.push(encodeURIComponent(param.name) + '=' + encodeURIComponent(param.value))
    })
    return '?' + array.join('&')
  } else {
    return ''
  }
}

export const objectToQueryParams = (object) => {
  return queryParams(objectToQuery(object))
}

