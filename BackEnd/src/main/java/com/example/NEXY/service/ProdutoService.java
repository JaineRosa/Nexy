package com.example.NEXY.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.NEXY.model.Categoria;
import com.example.NEXY.model.ImagemProduto;
import com.example.NEXY.model.Produto;
import com.example.NEXY.repository.CategoriaRepository;
import com.example.NEXY.repository.ImagemProdutoRepository;
import com.example.NEXY.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final ImagemProdutoRepository imagemProdutoRepository;
    private final CategoriaRepository categoriaRepository;
    private final Cloudinary cloudinary;

    public ProdutoService(ProdutoRepository produtoRepository,
                          ImagemProdutoRepository imagemProdutoRepository,
                          CategoriaRepository categoriaRepository,
                          Cloudinary cloudinary) {
        this.produtoRepository = produtoRepository;
        this.imagemProdutoRepository = imagemProdutoRepository;
        this.categoriaRepository = categoriaRepository;
        this.cloudinary = cloudinary;
    }

    @Transactional
    public Produto save(Produto produto) {
        Long categoriaId = produto.getCategoria().getId();
        Categoria categoriaReal = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com id " + categoriaId));

        if (produto.getId() == null || produto.getId() == 0) {

            produto.setCategoria(categoriaReal);
            return produtoRepository.save(produto);

        } else {
            Optional<Produto> produtoExistenteOpt = produtoRepository.findById(produto.getId());
            if (produtoExistenteOpt.isEmpty()) {
                throw new RuntimeException("Produto não encontrado com id " + produto.getId());
            }

            Produto produtoExistente = produtoExistenteOpt.get();

            produtoExistente.setNome(produto.getNome());
            produtoExistente.setDescricao(produto.getDescricao());
            produtoExistente.setPreco(produto.getPreco());
            produtoExistente.setEstoque(produto.getEstoque());
            produtoExistente.setPeso(produto.getPeso());
            produtoExistente.setAltura(produto.getAltura());
            produtoExistente.setLargura(produto.getLargura());
            produtoExistente.setCategoria(categoriaReal);
            return produtoRepository.save(produtoExistente);
        }
    }

    @Transactional
    public Produto findById(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id " + id));
    }


    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }


    public void delete(Long id) {
        produtoRepository.deleteById(id);
    }

    @Transactional
    public List<String> salvarImagens(Long id, List<MultipartFile> imagens) throws IOException {
        Produto produto = this.findById(id);
        List<String> urls = new ArrayList<>();

        for (MultipartFile imagem : imagens) {
            if (imagem.isEmpty()) {
                continue; // Pula imagens vazias
            }

            // 1. Faz o upload para o Cloudinary
            Map uploadResult = cloudinary.uploader().upload(imagem.getBytes(), ObjectUtils.emptyMap());

            // 2. Pega a URL segura que o Cloudinary retornou
            String urlImagem = uploadResult.get("secure_url").toString();

            // 3. Salva essa URL no banco de dados
            ImagemProduto novaImagem = new ImagemProduto();
            novaImagem.setUrl(urlImagem); // <-- Salva a URL do Cloudinary
            novaImagem.setProduto(produto);

            if (produto.getImagens() == null) {
                produto.setImagens(new ArrayList<>());
            }
            produto.getImagens().add(novaImagem);
            urls.add(urlImagem);
        }

        produtoRepository.save(produto);
        return urls;
    }

    public List<Produto> getProductsByCategoryId(Long categoriaId) {
        return produtoRepository.findByCategoriaId(categoriaId);
    }

    @Transactional
    public void deleteImagem(Long imagemId) throws IOException {
        ImagemProduto imagem = imagemProdutoRepository.findById(imagemId)
                .orElseThrow(() -> new RuntimeException("Imagem não encontrada com id " + imagemId));

        // --- LÓGICA DE DELETAR DO CLOUDINARY ---
        // 1. Pega a URL da imagem (ex: "https://res.cloudinary.com/.../public_id.jpg")
        String url = imagem.getUrl();

        // 2. Extrai o "public_id" da URL (o nome do arquivo sem a extensão)
        String publicId = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));

        try {
            // 3. Manda o Cloudinary deletar a imagem usando o public_id
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            System.err.println("Falha ao deletar imagem do Cloudinary: " + publicId);
            e.printStackTrace();
            // (Não pare o processo, apenas logue. Ainda queremos deletar do banco)
        }
        // --- FIM DA LÓGICA DO CLOUDINARY ---

        // (O resto do seu código para deletar do banco está perfeito)
        Produto produto = imagem.getProduto();
        if (produto != null && produto.getImagens() != null) {
            produto.getImagens().remove(imagem);
        }
        imagemProdutoRepository.delete(imagem);
    }
}

