import { createRouter, createWebHistory } from "vue-router";

const BooksList = () => import("./views/BookList.vue");
const BookNew = () => import("./views/BookNew.vue");
const BookDetail = () => import("./views/BookDetail.vue");
const BookEdit = () => import("./views/BookEdit.vue");

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/books" },
    { path: "/books", component: BooksList },
    { path: "/books/new", component: BookNew },
    { path: "/books/:id", component: BookDetail },
    { path: "/books/:id/edit", component: BookEdit },
  ],
});
