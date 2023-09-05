import express from 'express';
import { buscarHistorico, buscarHistoricoPorAno, buscarHistoricoPorId, calcularReajuste, validacaoErro } from './servicos/servico.js';

const app = express();

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const dataInicialMes = parseInt(req.query.mesInicial);
    const dataInicialAno = parseInt(req.query.anoInicial);
    const dataFinalMes = parseInt(req.query.mesFinal);
    const dataFinalAno = parseInt(req.query.anoFinal);

    if (validacaoErro(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno)) {
        res.status(400).json({ erro: 'Parâmetros inválidos' });
        return;
    }

    const resultado = calcularReajuste(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno);
    res.json({ resultado: resultado });
});

app.get('/historicoIPCA/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(404).json({ erro: 'ID inválido' });
        return;
    }

    const elemento = buscarHistoricoPorId(id);
    if (elemento) {
        res.json(elemento);
    } else {
        res.status(404).json({ erro: 'Elemento não encontrado' });
    }
});

app.get('/historicoIPCA', (req, res) => {
    const ano = parseInt(req.query.ano);

    if (isNaN(ano)) {
        res.json(buscarHistorico());
    } else {
        const resultado = buscarHistoricoPorAno(ano);
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ erro: 'Nenhum histórico encontrado para o ano especificado' });
        }
    }
});

app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080');
});