<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getBook, deleteBook } from "../api/books";
import type { Book } from "../types";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const book = ref<Book | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    book.value = await getBook(id);
  } catch (e) {
    error.value = "No se pudo cargar el libro";
  } finally {
    loading.value = false;
  }
});

// Modal de eliminación
const showDelete = ref(false);
const deleting = ref(false);
const deleteError = ref<string | null>(null);

async function confirmDelete() {
  deleting.value = true;
  deleteError.value = null;
  try {
    await deleteBook(id);
    router.push("/books"); // vuelve al listado tras eliminar
  } catch (e) {
    deleteError.value = "No se pudo eliminar el libro";
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <div class="p-4 max-w-xl">
    <router-link to="/books" class="inline-block mb-4 underline"
      >← Volver al listado</router-link
    >

    <p v-if="loading">Cargando…</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else-if="book" class="space-y-2">
      <h1 class="text-2xl font-bold">{{ book.title }}</h1>
      <p><span class="font-semibold">Autor:</span> {{ book.author }}</p>
      <p>
        <span class="font-semibold">Publicación:</span> {{ book.published }}
      </p>
      <p><span class="font-semibold">Categoría:</span> {{ book.category }}</p>
      <p><span class="font-semibold">Stock:</span> {{ book.stock }}</p>

      <div class="mt-4 flex gap-2">
        <router-link
          :to="`/books/${book.id}/edit`"
          class="px-3 py-2 border rounded"
          >Editar</router-link
        >
        <button
          class="px-3 py-2 border rounded bg-red-600 text-black"
          @click="showDelete = true"
        >
          Eliminar
        </button>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div
      v-if="showDelete"
      class="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      @click.self="showDelete = false"
    >
      <div class="bg-white rounded-lg p-4 w-full max-w-sm">
        <h2 id="delete-title" class="text-lg font-semibold">Eliminar libro</h2>
        <p class="mt-2 text-sm">
          ¿Seguro que quieres eliminar este libro? Esta acción no se puede
          deshacer.
        </p>

        <p v-if="deleteError" class="text-red-600 text-sm mt-2">
          {{ deleteError }}
        </p>

        <div class="mt-4 flex justify-end gap-2">
          <button
            class="px-3 py-2 border rounded"
            @click="showDelete = false"
            :disabled="deleting"
          >
            Cancelar
          </button>
          <button
            class="px-3 py-2 rounded bg-red-600 text-black"
            @click="confirmDelete"
            :disabled="deleting"
          >
            {{ deleting ? "Eliminando…" : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
