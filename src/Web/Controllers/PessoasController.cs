using Microsoft.AspNetCore.Mvc;
using Sistema_Gestao_de_Gastos.Domain.Entities;
using Sistema_Gestao_de_Gastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Sistema_Gestao_de_Gastos.Application.Dtos.Requests;
using Sistema_Gestao_de_Gastos.Domain.Exceptions;

namespace Sistema_Gestao_de_Gastos.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly GastoContext _context;

        public PessoasController(GastoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            return await _context.Pessoas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> GetPessoa(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
            {
                return NotFound(new {mensagem = "Pessoa não encontrada."});
            }
            return pessoa;
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(CriarPessoaRequest request)
        {
            try
            {
                var novaPessoa = new Pessoa(request.Nome, request.Idade);

                _context.Pessoas.Add(novaPessoa);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPessoa), new {id = novaPessoa.Id}, novaPessoa);
            }
            catch (RegraDeNegocioException ex)
            {
                return BadRequest(new {mensagem = ex.Message});
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return NotFound(new {mensagem = "Pessoa nao encontrada."});
            }

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return Ok(new {mensagem = $"{pessoa.Nome} foi removido(a) com sucesso."});
        }
    
    }
}