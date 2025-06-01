function search()
{
  const listTemplate = document.querySelector("[user-template]");
  const container = document.querySelector("[data-user-container]");
  const dataInput = document.querySelector("[data-search]");
  
  let store = [];
dataInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  store.forEach(user => {
    const isVisible = user.name.toLowerCase().includes(value);
    user.element.classList.toggle("hide", !isVisible);
  });
});

if (!listTemplate) {
  console.error("Template element with attribute 'user-template' not found");
}

if (!container) {
  console.error("Container element with attribute 'data-user-container' not found");
}

fetch('../data/department-info.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    store = data.map(department => {
      const li = listTemplate.content.cloneNode(true).querySelector("li");
      li.innerHTML = `<a href="./departmentSearch.html" class="item-link" link>${department[1]}</a>`;

      const link = li.querySelector('[link]');
       link.addEventListener('click', (e) => {
          e.preventDefault()
           localStorage.setItem('id', department[0]);
  window.location.href = "../html/departmentSearch.html";
       })


      container.append(li);
      return { name: department[1], element: li };
    });
  })
  .catch(error => console.error("Error loading file:", error));
}
