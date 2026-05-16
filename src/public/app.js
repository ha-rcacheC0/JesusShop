document.addEventListener("DOMContentLoaded", () => {
  // themes
  const cssRoot = document.documentElement;
  const sun = document.querySelector(".sun");
  const moon = document.querySelector(".moon");

  function darkTheme() {
    cssRoot.style.setProperty("--w", "#1d1c1c");
    cssRoot.style.setProperty("--b", "#fbfbfb");

    sun.style.display = "none";
    moon.style.display = "block";

    localStorage.setItem("theme", "dark");
  }

  function lightTheme() {
    cssRoot.style.setProperty("--w", "#fbfbfb");
    cssRoot.style.setProperty("--b", "#1d1c1c");

    moon.style.display = "none";
    sun.style.display = "block";

    localStorage.setItem("theme", "light");
  }

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    darkTheme();
  } else {
    lightTheme();
  }

  sun.addEventListener("click", darkTheme);
  moon.addEventListener("click", lightTheme);

  // search bar
  const search = document.getElementById("search");

  search.addEventListener("input", () => {
    const value = search.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".shop-card");
    cards.forEach((card) => {
      const title = card
        .querySelector(".card-title")
        .textContent.toLowerCase()
        .trim();
      if (title.includes(value)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });

  // load products
  async function loadProducts() {
    const response = await fetch("/api/products");

    const products = await response.json();

    const container = document.getElementById("shop-section");

    container.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "shop-card";

      const img = document.createElement("img");
      img.src = product.imageURL;
      img.alt = `${product.color} ${product.gender} ${product.category}`;

      const title = document.createElement("div");
      title.className = "card-title";
      title.textContent = `${product.gender} ${product.color} ${product.category}`;

      const price = document.createElement("div");
      price.className = "card-price";
      price.textContent = `$${product.price}`;

      const button = document.createElement("button");
      button.textContent = "Add To Cart";

      const btnWrapper = document.createElement("div");
      btnWrapper.className = "card-btn";
      btnWrapper.appendChild(button);

      const imgWrapper = document.createElement("div");
      imgWrapper.className = "card-img";
      imgWrapper.appendChild(img);

      card.appendChild(imgWrapper);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(btnWrapper);

      container.appendChild(card);
    });
  }

  loadProducts();
});
