import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import apiCall from "./utils/request";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [current, setCurrent] = useState({});
  const { handleSubmit, register, reset } = useForm();
  useEffect(() => {
    apiCall("/products", "get").then((res) => {
      setProducts(res.data);
    });
  },[]);

  function myS(data) {
    console.log(data);
    apiCall("/products", "post", data).then(() => {
      apiCall("/products", "get").then((res) => {
        setProducts(res.data);
        setIsOpen(false);
      });
    });
  }

  function sotish(id) {
    setIsOpen2(true);
    setCurrent(id);
  }

  function myS2(data) {
    console.log(current.count);
    console.log(data);
    var a = current.count - data.count2;
    console.log(a);
    if (a < 0) {
      toast.error(
        `siz ${0 - a} ta ko'p sotdingiz hozir ${
          Number(a) + Number(data.count)
        } ta produkt sotildi`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      toast.error(`Bu mahsulot tugadi`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      a = Number(a) + Number(data.count2);
      apiCall("/products/" + current.id, "delete").then(() => {
        apiCall("/products", "get").then((res) => {
          setProducts(res.data);
          setIsOpen2(false);
        });
      });
    } else {
      apiCall("/products/" + current.id, "patch", { count: a }).then(() => {
        apiCall("/products", "get").then((res) => {
          setProducts(res.data);
          setIsOpen2(false);
        });
      });
    }
  }

  function deleteItem(id) {
    apiCall("/products/" + id, "delete").then(() => {
      apiCall("/products", "get").then((res) => {
        setProducts(res.data);
      });
    });
  }

  function search(e) {
    apiCall('/products?name_like='+e.target.value,'get').then(res=>{
      setProducts(res.data)
    })
  }

  return (
    <div className="p-2">
      <ToastContainer />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn mb-2 btn-success"
      >
        Add product
      </button>
      <div className="flex mb-2 justify-between gap-2 pr-16">
        <input
        onChange={search}
          placeholder="Search product"
          type="text"
          className="form-control"
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Miqdor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((itm,i) => (
            <tr>
              <td>{i+1}</td>
              <td>{itm.id}</td>
              <td>{itm.name}</td>
              <td>{itm.price}</td>
              <td>{itm.count}</td>
              <td>
                <button
                  onClick={() => deleteItem(itm.id)}
                  className="btn btn-danger"
                >
                  delete
                </button>
                <button
                  onClick={() => sotish(itm)}
                  className="btn btn-success ml-1"
                >
                  Sotish
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Rodal visible={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <form onSubmit={handleSubmit(myS)}>
          <input
            type="text"
            {...register("name")}
            placeholder="mahsulot nomini kiriting"
            className="form-control mb-2 mt-4"
          />
          <input
            type="number"
            {...register("price")}
            placeholder="mahsulot narxini kiriting"
            className="form-control mb-2"
          />
          <input
            type="number"
            {...register("count")}
            placeholder="mahsulot sonini kiriting"
            className="form-control mb-2"
          />
          <button className="btn btn-success d-block w-50 mx-auto">save</button>
        </form>
      </Rodal>
      <Rodal visible={isOpen2} onClose={() => setIsOpen2(!isOpen2)}>
        <form onSubmit={handleSubmit(myS2)}>
          <input
            type="number"
            {...register("count2")}
            placeholder="mahsulot sonini kiriting"
            className="form-control mb-2"
          />
          <button className="btn btn-success d-block w-50 mx-auto">save</button>
        </form>
      </Rodal>
    </div>
  );
};

export default App;
