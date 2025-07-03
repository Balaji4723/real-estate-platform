const properties = [
  {
    image: "chennai estate.jpeg",
    title: "Modern Family Home",
    location: "Chennai, India",
    price: "₹75 Lakhs"
  },
  {
    image: "banglore.jpeg",
    title: "Luxury Apartment",
    location: "Bangalore, India",
    price: "₹1.2 Crore"
  }
];

const container = document.getElementById("property-list");

properties.forEach((prop) => {
  const card = `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${prop.image}" class="card-img-top" alt="${prop.title}">
        <div class="card-body">
          <h5 class="card-title">${prop.title}</h5>
          <p class="card-text"><strong>Location:</strong> ${prop.location}</p>
          <p class="card-text"><strong>Price:</strong> ${prop.price}</p>
        </div>
      </div>
    </div>`;
  container.innerHTML += card;
});
