const faqs = document.querySelectorAll(".faq");

faqs.forEach(faq => {
  faq.addEventListener("click", () => {

    // Close other FAQs
    faqs.forEach(item => {
      if (item !== faq) {
        item.classList.remove("active");
      }
    });

    // Toggle current FAQ
    faq.classList.toggle("active");
  });
});
