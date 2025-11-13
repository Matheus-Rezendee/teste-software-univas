import { render, screen, waitFor } from '@testing-library/react'
import Categories from "../../src/components/Categories"
import { server, apiGet, json } from '../setup'

describe('Categories integration - carga da lista', () => {
  it('renderiza categorias retornadas pela API', async () => {
    server.use(
      apiGet('/categories', () =>
        json({
          data: [
            { id: '1', name: 'Trabalho' },
            { id: '2', name: 'Pessoal' }
          ]
        })
      )
    )

    render(<Categories />)

    await waitFor(() => {
      expect(screen.getByText('Trabalho')).toBeInTheDocument()
      expect(screen.getByText('Pessoal')).toBeInTheDocument()
    })
  })

  it('exibe fallback de erro quando a API falha', async () => {
    server.use(
      apiGet('/categories', () => new Response(null, { status: 500 }))
    )

    render(<Categories />)

    await waitFor(() => {
      // Ajuste aqui para o texto que seu componente realmente mostra
      expect(screen.getByText(/erro/i)).toBeInTheDocument()
    })
  })
})
