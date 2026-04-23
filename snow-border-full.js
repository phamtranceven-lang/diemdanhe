/* VIỀN 7 MÀU CHUẨN - KHÔNG CHE WEB */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  padding: 2px; /* độ dày viền */
  border-radius: 0px;
  pointer-events: none;
  z-index: 9999;

  background: linear-gradient(
    90deg,
    #ff0000,
    #ff7a00,
    #ffd400,
    #00d95f,
    #00cfff,
    #2f6bff,
    #a100ff,
    #ff0000
  );
  background-size: 300% 300%;
  animation: borderMove 6s linear infinite;

  /* 👇 CÁI QUAN TRỌNG NHẤT (khoét ruột) */
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
}

/* animation */
@keyframes borderMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}
