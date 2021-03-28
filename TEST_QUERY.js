query {
  blog(id:"5504473567091228673") {
    title
  }
}
query {
  blogs(limit: 15) {
    items {
      id, title
    },
    meta {
      itemCount,
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage
    }
  }
}
mutation {
  createUser(input: {
    firstName:"Vr",
    lastName:"reborn",
    username:"ductuantb98@gmail.com",
    age:23,
    roles: ["BASE","ADMIN"]
  }) {
    id,firstName
  }
}
mutation {
  createCategory(input:{
    title:"Category two",
  }) {
    title,
    id
  }
}
mutation {
  createUser(input: {
    firstName:"Vr",
    lastName:"reborn",
    username:"ductuantb98@gmail.com",
    age:23,
    roles: ["BASE","ADMIN"]
  }) {
    id,firstName
  }
}
mutation {
  createBlog(input: {
    title: "Tesst blog two",
    views: 1,
    content:"contentsd asdadad ",
    isPublished: false,
    createdAt: "2019-12-03T09:54:33Z",
    updatedAt:"2019-12-03T09:54:33Z",
    categories: ["5504470707079217153"]
  }) {
    title
  }
}
