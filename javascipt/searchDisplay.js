const sharedId = localStorage.getItem('id')

fetch('../data/department-info.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
.then(data => 
{
    data.forEach(department => {
        if(department[0]==sharedId)
        {
            document.getElementById('name').textContent = department[1];
            document.getElementById('PK').textContent = department[2];
            document.getElementById('State').textContent = department[3];
            document.getElementById('Adress').textContent = department[4];
            document.getElementById('TelefoneNum').textContent = department[5];
            document.getElementById('Email').textContent = department[6];
        }
    });
}
)
.catch(error => console.error("Error loading file:", error));