"use client"
import React, { useEffect, useState } from "react";

export default function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const products = () => {
      fetch('http://localhost:3000/api/products').then((res) => res.json()).then((result) => {
        setProducts(result.products)
      })
    }
    products();

  }, [])
  return (
    <div>
      <h1>Products list</h1>
      {products.map((product) => {
        return (
          <div key={product?.id}>
            {
              product?.title
            }
          </div>
        )
      })

      }
    </div>
  );
}
