import axiosInstance from "../../axios";

class OrderService {
    endPath = "order"

    addOrder(order) {
        return axiosInstance.post(`${this.endPath}`, order)
    }
    
}

export default new OrderService();