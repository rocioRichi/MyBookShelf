<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { createBook } from "../api/books";
import type { Book } from "../types";

const router = useRouter();

// modelo con valores iniciales
const form = ref<Book>({
  title: "",
  author: "",
  published: new Date().toISOString().slice(0, 10), // hoy
  category: "",
  stock: 0,
});

const categories = ["Ficción", "No ficción", "Software", "Ciencia", "Historia"];

// ---------- validaciones ----------
const errors = ref<{ [K in keyof Book]?: string }>({});

function validateField<K extends keyof Book>(k: K) {
  const v = form.value[k] as any;
  switch (k) {
    case "title":
    case "author":
      errors.value[k] =
        typeof v === "string" && v.trim().length >= 3
          ? ""
          : "Mínimo 3 caracteres";
      break;
    case "published": {
      const today = new Date().toISOString().slice(0, 10);
      errors.value.published =
        v && v <= today ? "" : "La fecha no puede ser futura";
      break;
    }
    case "category":
      errors.value.category = v ? "" : "Elige una categoría";
      break;
    case "stock":
      errors.value.stock = Number.isInteger(v) && v >= 0 ? "" : "Entero ≥ 0";
      break;
  }
}

function validateAll() {
  (
    ["title", "author", "published", "category", "stock"] as (keyof Book)[]
  ).forEach(validateField);
}

const isValid = computed(() =>
  ["title", "author", "published", "category", "stock"].every(
    (k) => !errors.value[k as keyof Book]
  )
);

// ---------- acciones ----------
const sending = ref(false);
const submitError = ref<string | undefined>(undefined);

async function onSubmit() {
  validateAll();
  if (!isValid.value) return;

  sending.value = true;
  submitError.value = undefined;
  try {
    const created = await createBook(form.value);
    // ir al detalle del libro creado
    router.push(`/books/${created.id}`);
  } catch (e) {
    submitError.value = "No se pudo crear el libro";
  } finally {
    sending.value = false;
  }
}

function onCancel() {
  // confirmación simple (la modal la haremos en la vista de edición)
  if (confirm("¿Descartar cambios?")) router.push("/books");
}
</script>

<template>
  <div class="p-4 max-w-xl">
    <h1 class="text-xl font-bold mb-4">Nuevo libro</h1>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm mb-1">Título</label>
        <input
          class="border rounded p-2 w-full"
          v-model.trim="form.title"
          @input="validateField('title')"
          placeholder="Ej. Clean Code"
        />
        <p v-if="errors.title" class="text-red-600 text-sm">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label class="block text-sm mb-1">Autor</label>
        <input
          class="border rounded p-2 w-full"
          v-model.trim="form.author"
          @input="validateField('author')"
          placeholder="Ej. Robert C. Martin"
        />
        <p v-if="errors.author" class="text-red-600 text-sm">
          {{ errors.author }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="sm:col-span-1">
          <label class="block text-sm mb-1">Publicación</label>
          <input
            type="date"
            class="border rounded p-2 w-full"
            v-model="form.published"
            @input="validateField('published')"
          />
          <p v-if="errors.published" class="text-red-600 text-sm">
            {{ errors.published }}
          </p>
        </div>

        <div class="sm:col-span-1">
          <label class="block text-sm mb-1">Categoría</label>
          <select
            class="border rounded p-2 w-full"
            v-model="form.category"
            @change="validateField('category')"
          >
            <option value="" disabled>Selecciona…</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <p v-if="errors.category" class="text-red-600 text-sm">
            {{ errors.category }}
          </p>
        </div>

        <div class="sm:col-span-1">
          <label class="block text-sm mb-1">Stock</label>
          <input
            type="number"
            min="0"
            step="1"
            class="border rounded p-2 w-full"
            v-model.number="form.stock"
            @input="validateField('stock')"
          />
          <p v-if="errors.stock" class="text-red-600 text-sm">
            {{ errors.stock }}
          </p>
        </div>
      </div>

      <div class="flex gap-2 justify-end pt-2">
        <button
          type="button"
          class="px-3 py-2 border rounded"
          @click="onCancel"
        >
          Descartar
        </button>
        <button
          type="submit"
          class="px-3 py-2 rounded text-black bg-gray-200"
          :class="isValid ? 'bg-black' : 'bg-gray-400 cursor-not-allowed'"
          :disabled="!isValid || sending"
        >
          {{ sending ? "Guardando…" : "Guardar" }}
        </button>
      </div>

      <p v-if="submitError" class="text-red-600 text-sm mt-2">
        {{ submitError }}
      </p>
    </form>
  </div>
</template>
