
const randomId = (arr) => {
  let usedId = [];
  let response = {}
  arr.slice(1,20).forEach((value) => {
    let id = 0;
    while (usedId.indexOf(id) !== -1 || id === 0) {
      console.log(id)
      id = Math.ceil(Math.random() * arr.length)
    }
    response = {
      ...response,
      [id]: value
    }
  })
  return response
}

const randomId2 = (arr) => {
  let usedId = [];
  return arr.map((value) => {
    let id = 0;
    while (usedId.indexOf(id) !== -1 || id === 0) {
      console.log(id)
      id = Math.ceil(Math.random() * arr.length)
    }
    return {
      [id]: value
    }
  })
}

export default randomId;
