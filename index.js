const hoaxer = require('hoaxer');
const { Client } = require('pg');
const cpfCheck = require('cpf-check');

// Configuração de conexão com o banco de dados
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

async function run() {
  try {
    // Conexão com o banco de dados
    await client.connect();

    // Gerando dados de jogadores aleatórios
    const jogadores = [];
    for (let i = 0; i < 2000; i++) {
      const cpfGenerate = cpfCheck.generate(true)
      const jogador = {
        cpf: cpfGenerate,
        nome: hoaxer.fake('person.firstName') + ' ' + hoaxer.fake('person.lastName'),
        posicao: hoaxer.random.arrayElement(['Goleiro','Lateral','Zagueiro','Meio-Campo','Atacante']),
        id_equipe: hoaxer.random.number({ min: 1,max: 20 }), // considerando que há 20 equipes cadastradas no banco de dados
        salario: hoaxer.random.number({ min: 1000,max: 20000,precision: 2 }), // salário entre R$ 1000 e R$ 20000
      };
      jogadores.push(jogador);
    }

    // Inserindo jogadores no banco de dados
    const query = 'INSERT INTO jogadores (cpf, nome, posicao, id_equipe, salario) VALUES ($1, $2, $3, $4, $5)';
    for (const jogador of jogadores) {
      const values = [jogador.cpf,jogador.nome,jogador.posicao,jogador.id_equipe,jogador.salario];
      const res = await client.query(query,values);
      console.log('Jogador inserido com sucesso:',jogador);
    }

    // Fechando conexão com o banco de dados
    await client.end();
  } catch (err) {
    console.error(err);
  }
}

run();