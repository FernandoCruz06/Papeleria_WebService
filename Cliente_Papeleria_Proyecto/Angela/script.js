document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("productList");
  const addProductBtn = document.getElementById("addProductBtn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalForm = document.getElementById("modalForm");
  const modalSubmitBtn = document.getElementById("modalSubmitBtn");

  let editingProductId = null;

  // Función para cargar los productos desde la API
  function loadProducts() {
    fetch("http://localhost/servicioREST_Papeleria/Servicios_Angela/obtener_productos.php")
      .then(response => response.json())
      .then(data => {
        productList.innerHTML = "";
        data.forEach(product => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>${product.precio}</td>
            <td>${product.cantidad_inventario}</td>
            <td>${product.proveedor}</td>
            <td>
              <button class="editBtn" data-id="${product.id}">Editar</button>
              <button class="deleteBtn" data-id="${product.id}">Eliminar</button>
            </td>
          `;
          productList.appendChild(row);
        });
      });
  }

  // Cargar los productos al cargar la página
  loadProducts();

  // Agregar evento al botón de agregar producto
  addProductBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Producto";
    modalSubmitBtn.textContent = "Agregar";
    modalForm.reset();
    editingProductId = null;
    modal.style.display = "block";
  });

  // Delegación de eventos para botones de editar y eliminar
  productList.addEventListener("click", e => {
    if (e.target.classList.contains("editBtn")) {
      const productId = e.target.getAttribute("data-id");
      editingProductId = productId;
      modalTitle.textContent = "Editar Producto";
      modalSubmitBtn.textContent = "Guardar Cambios";

      // Cargar los datos del producto a editar y mostrar el modal de edición
      fetch(`http://localhost/servicioREST_Papeleria/Servicios_Angela/obtener_producto.php?id=${productId}`)
        .then(response => response.json())
        .then(product => {
          modalForm.nombre.value = product.nombre;
          modalForm.precio.value = product.precio;
          modalForm.cantidad_inventario.value = product.cantidad_inventario;
          modalForm.proveedor_id.value = product.proveedor;
          modal.style.display = "block";
        });
    } else if (e.target.classList.contains("deleteBtn")) {
      const productId = e.target.getAttribute("data-id");
      if (confirm("¿Estás seguro de eliminar este producto?")) {
        // Llamar a la función para eliminar el producto
        deleteProduct(productId);
      }
    }
  });

  // Función para eliminar un producto
  function deleteProduct(productId) {
    fetch("http://localhost/servicioREST_Papeleria/Servicios_Angela/eliminar.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `id=${productId}`
    })
    .then(response => response.text())
    .then(message => {
      alert(message);
      loadProducts();
    });
  }

  // Mostrar el modal de agregar/editar
  modalSubmitBtn.addEventListener("click", () => {
    const formData = new FormData(modalForm);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    if (editingProductId) {
      formObject.id = editingProductId;
      // Llamar a la función para editar el producto
      editProduct(formObject);
    } else {
      // Llamar a la función para agregar el producto
      addProduct(formObject);
    }

    modal.style.display = "none";
  });

  // Puedes agregar funciones para las operaciones de agregar y editar productos
  function addProduct(productData) {
    fetch("http://localhost/servicioREST_Papeleria/Servicios_Angela/insertar.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(productData)
    })
    .then(response => response.text())
    .then(message => {
      alert(message);
      loadProducts();
    });
  }

  function editProduct(productData) {
    fetch("http://localhost/servicioREST_Papeleria/Servicios_Angela/modificar.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(productData)
    })
    .then(response => response.text())
    .then(message => {
      alert(message);
      loadProducts();
    });
  }

  // Cerrar el modal al hacer clic fuera de él
  window.addEventListener("click", event => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});




  