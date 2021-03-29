query {
  blog(id:"5505586410666590209") {
    title,
    id,
    categories
  }
}
query {
  blogs(limit: 3, page:1) {
    items {
      categories,
      id,title
    },
    meta{
      itemCount,
      itemsPerPage,
      totalItems,
      currentPage,
      totalPages
    }
  }
}
query {
  users(limit: 2, page:1) {
    items {
      id, username
    },
    meta{
      itemCount,
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
    }
  }
}
query {
  category(id:"5505467378953093121") {
    title,
    owner {
      username
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
mutation {
  login(password:"vrreborn", username:"vr-reborn") {
    user {
      id,
      username
    },
    accessToken,
    refreshToken
  }
}
mutation {
	removeCategory(id:"5505476627376635905")
}
mutation {
  updateCategory(input:{
    title:"Category one ee",
    id:"5505467378953093121"
  }) {
    title,
    id,
    owner {
      username
    }
  }
}
mutation {
  updateBlog(input:{
    id: "5505591353167314945", title:"Blog two update"
  }) {
    id, title, content, categories
  }
}
mutation {
  removeBlog(id:"5505591353167314945")
}
