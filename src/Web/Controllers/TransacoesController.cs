using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sistema_Gestao_de_Gastos.Application.Dtos.Requests;
using Sistema_Gestao_de_Gastos.Domain.Entities;
using Sistema_Gestao_de_Gastos.Domain.Enums;
using Sistema_Gestao_de_Gastos.Domain.Exceptions;
using Sistema_Gestao_de_Gastos.Infrastructure.Data;

namespace Sistema_Gestao_de_Gastos.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly GastoContext _context;

        public TransacoesController(GastoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            return await _context.Transacoes.Include(t => t.Pessoa).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transacao>> GetTransacao(Guid id)
        {
            var transacao = await _context.Transacoes.Include(t => t.Pessoa).FirstOrDefaultAsync(t => t.Id == id);

            if (transacao == null)
            {
                return NotFound(new {mensagem = "Transacao nao encontrada."});
            }
            return transacao;
        }

        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao(RegistrarTransacaoRequest request)
        {
            try
            {
                var pessoa = await _context.Pessoas.FindAsync(request.PessoaId);

                if (pessoa == null)
                {
                    return BadRequest(new {mensagem = "A pessoa informada para esta transacao nao existe"});
                }

                var novaTransacao = new Transacao(request.Descricao, request.Valor, request.Tipo, pessoa);

                _context.Transacoes.Add(novaTransacao);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTransacao), new {id = novaTransacao.Id}, novaTransacao);
            }
            catch (RegraDeNegocioException ex)
            {
                return BadRequest(new {mensagem = ex.Message});
            }
            catch (IdadeMinimaException ex)
            {
                return BadRequest(new {mensagem = ex.Message});
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(Guid id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);

            if (transacao == null)
            {
                return NotFound(new {mensagem = "Transacao nao encontrada."});
            }

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            return Ok(new {mensagem = "Transacao removida com sucesso."});
        }
    }

    public record RegistrarTransacaoRequest(string Descricao, decimal Valor, TipoTransacao Tipo, Guid PessoaId);
}