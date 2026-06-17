export type Category = "placa-de-video" | "processador" | "gabinete" | "fan";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  cityId: string; // loja/centro de distribuição
}

export const CATEGORY_LABELS: Record<Category | "todos", string> = {
  todos: "Todas as Categorias",
  "placa-de-video": "Placas de Vídeo",
  processador: "Processadores",
  gabinete: "Gabinetes",
  fan: "Fans / Refrigeração",
};

export const PRODUCTS: Product[] = [
  // ---- Gabinetes ----
  { id: 1, name: "Elite Liquid Gold", description: "Performance extrema com estética dourada impecável para entusiastas, refrigeração líquida customizada.", price: 5499.0, category: "gabinete", cityId: "sp" },
  { id: 2, name: "Gabinete Customizado PC", description: "O equilíbrio perfeito entre fluxo de ar e espaço interno para grandes builds.", price: 939.99, category: "gabinete", cityId: "rj" },
  { id: 3, name: "Gabinete NZXT H9 Flow", description: "Painel de vidro duplo sem bordas, exibindo cada detalhe do seu hardware de luxo.", price: 1249.0, category: "gabinete", cityId: "bh" },
  { id: 4, name: "Lian Li O11 Dynamic EVO", description: "O gabinete mais modular do mundo, permitindo até montagens invertidas.", price: 1399.9, category: "gabinete", cityId: "cwb" },
  { id: 5, name: "Corsair 4000D Airflow", description: "Painel frontal otimizado com rotas de cabos que deixam qualquer build limpa.", price: 699.0, category: "gabinete", cityId: "poa" },
  { id: 6, name: "Gabinete Hyte Y60", description: "Design panorâmico de 3 peças em vidro temperado, elevando o nível visual do setup.", price: 1599.0, category: "gabinete", cityId: "bsb" },
  { id: 7, name: "Fractal North Charcoal", description: "Madeira de nogueira e malha metálica em um gabinete escandinavo premium.", price: 1099.0, category: "gabinete", cityId: "ssa" },

  // ---- Placas de Vídeo ----
  { id: 10, name: "RTX 4090 Nexus Edition", description: "A placa de vídeo mais poderosa do mercado, agora com resfriamento a ouro.", price: 13999.0, category: "placa-de-video", cityId: "sp" },
  { id: 11, name: "RTX 4080 Super 16GB", description: "Arquitetura Ada Lovelace com desempenho brutal para 4K e Ray Tracing avançado.", price: 8499.9, category: "placa-de-video", cityId: "rj" },
  { id: 12, name: "Radeon RX 7900 XTX 24GB", description: "A joia da AMD, oferecendo VRAM massiva e força bruta impressionante.", price: 7899.0, category: "placa-de-video", cityId: "bh" },
  { id: 13, name: "RTX 4070 Ti Super 16GB", description: "O sweet spot definitivo para jogos em 1440p com taxas de quadros extremas.", price: 6199.0, category: "placa-de-video", cityId: "cwb" },
  { id: 14, name: "Radeon RX 7800 XT 16GB", description: "Custo-benefício imbatível da linha vermelha para alta performance térmica.", price: 4399.99, category: "placa-de-video", cityId: "poa" },
  { id: 15, name: "RTX 4060 Ti 8GB Nexus OC", description: "Overclock de fábrica e suporte nativo ao DLSS 3 para dobrar seu FPS.", price: 2899.0, category: "placa-de-video", cityId: "rec" },
  { id: 16, name: "Radeon RX 7600 8GB", description: "A porta de entrada ideal para jogos em Full HD no ultra.", price: 1849.9, category: "placa-de-video", cityId: "for" },
  { id: 17, name: "RTX 5090 Founders Gold", description: "A nova geração Blackwell com 32GB GDDR7, o ápice absoluto da performance gamer.", price: 18999.0, category: "placa-de-video", cityId: "sp" },
  { id: 18, name: "Radeon RX 7700 XT 12GB", description: "Excelente desempenho em 1440p com VRAM generosa para texturas ultra.", price: 3299.0, category: "placa-de-video", cityId: "gyn" },
  { id: 19, name: "Intel Arc A770 16GB", description: "A aposta da Intel com ótimo desempenho em Ray Tracing e XeSS.", price: 1999.0, category: "placa-de-video", cityId: "fln" },

  // ---- Processadores ----
  { id: 30, name: "Processador Intel Core i9-14900K", description: "Velocidade extrema para renderizações e jogos pesados, até 6.0GHz.", price: 4299.0, category: "processador", cityId: "sp" },
  { id: 31, name: "AMD Ryzen 9 7950X3D", description: "A tecnologia 3D V-Cache faz desse processador o rei absoluto do universo gamer.", price: 4999.0, category: "processador", cityId: "rj" },
  { id: 32, name: "Intel Core i7-14700K", description: "20 núcleos híbridos entregando o balanço perfeito entre multitarefa e gaming.", price: 2899.99, category: "processador", cityId: "bh" },
  { id: 33, name: "AMD Ryzen 7 7800X3D", description: "Eficiência energética e desempenho monstruoso em jogos graças ao cache empilhado.", price: 2949.0, category: "processador", cityId: "cwb" },
  { id: 34, name: "Intel Core i5-13600K", description: "O processador mid-end que desafia as linhas superiores em qualquer benchmark.", price: 1999.0, category: "processador", cityId: "poa" },
  { id: 35, name: "AMD Ryzen 5 7600X", description: "Velocidade base incrível de 4.7GHz, destravando a plataforma AM5.", price: 1549.0, category: "processador", cityId: "bsb" },
  { id: 36, name: "Intel Core i5-12400F", description: "Excelente custo por frame, ideal para orçamentos focados na placa de vídeo.", price: 849.99, category: "processador", cityId: "mao" },
  { id: 37, name: "AMD Ryzen 9 9950X", description: "Arquitetura Zen 5 com 16 núcleos para produtividade e gaming sem compromissos.", price: 5499.0, category: "processador", cityId: "sp" },
  { id: 38, name: "AMD Ryzen 7 9800X3D", description: "O novo campeão de FPS em jogos, com 3D V-Cache de segunda geração.", price: 3599.0, category: "processador", cityId: "gyn" },
  { id: 39, name: "Intel Core Ultra 9 285K", description: "Plataforma Arrow Lake com NPU integrada para tarefas de IA aceleradas.", price: 4699.0, category: "processador", cityId: "fln" },

  // ---- Fans / Refrigeração ----
  { id: 50, name: "Kit Corsair iCUE QL120 RGB (3-Pack)", description: "Quatro zonas de iluminação independentes para um show de luzes hipnotizante.", price: 849.0, category: "fan", cityId: "sp" },
  { id: 51, name: "Lian Li UNI FAN SL-INFINITY (3-Pack)", description: "Conexão em cadeia sem cabos extras e o lendário espelho infinito no centro.", price: 899.99, category: "fan", cityId: "rj" },
  { id: 52, name: "Noctua NF-A12x25 PWM", description: "Silêncio absoluto e pressão estática insuperável. O auge da engenharia térmica.", price: 259.0, category: "fan", cityId: "bh" },
  { id: 53, name: "Water Cooler Corsair iCUE H150i Elite", description: "Radiador de 360mm com tela LCD personalizável para monitorar as temperaturas.", price: 1699.0, category: "fan", cityId: "cwb" },
  { id: 54, name: "Water Cooler NZXT Kraken Elite 360", description: "Bomba Asetek de 7ª geração, resfriando os processadores mais quentes sem ruído.", price: 1899.0, category: "fan", cityId: "poa" },
  { id: 55, name: "Arctic Liquid Freezer III 420", description: "Refrigeração líquida AIO de 420mm com a melhor relação custo-térmica do mercado.", price: 1099.0, category: "fan", cityId: "rec" },
  { id: 56, name: "Kit Nexus Aurora Gold (6-Pack)", description: "Seis fans com anel RGB dourado exclusivo Nexus e controladora inclusa.", price: 1299.0, category: "fan", cityId: "for" },
];