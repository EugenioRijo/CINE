import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Title,
  Subtitle,
  ThemeProps
} from './shared/CommonStyles';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'combo' | 'popcorn' | 'drinks' | 'snacks';
  size?: 'S' | 'M' | 'L' | 'XL';
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Combo extends Product {
  quantity: number;
}

interface SnackBarMenuProps {
  mode: 'dark' | 'light';
  onCombosSelected?: (combos: Combo[]) => void;
  showOnlyInBooking?: boolean;
}

const MovieIcon = styled.div<ThemeProps>`
  font-size: 40px;
  margin-bottom: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

const MainContent = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: rgba(255, 255, 255, 0);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled.div<{ isSelected: boolean }>`
  background: rgba(255, 253, 250, 0.9);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.2s ease;
  border: 2px solid ${(props: { isSelected: boolean }) => props.isSelected ? '#4BB543' : 'transparent'};
  box-shadow: ${(props: { isSelected: boolean }) => props.isSelected ? '0 4px 12px rgba(75, 181, 67, 0.2)' : 'none'};
`;

const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  color: #4a4a4a;
  margin: 0.5rem 0;
  font-size: 1.2rem;
`;

const ProductDescription = styled.p`
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const ProductPrice = styled.div`
  color: #41E1E1;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #41E1E1;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(65, 225, 225, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuantityText = styled.span`
  color: #4a4a4a;
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
`;

const SelectedBadge = styled.div`
  background: rgba(75, 181, 67, 0.1);
  color: #4BB543;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 1.2rem;
  }
`;

const combos: Combo[] = [
  {
    id: 1,
    name: 'Combo Vía Láctea',
    description: 'Palomitas grandes + 2 Refrescos medianos + 1 Chocolate',
    price: 12.99,
    image: '/images/combo1.jpg',
    quantity: 0,
    category: 'combo'
  },
  {
    id: 2,
    name: 'Combo Andrómeda',
    description: 'Palomitas jumbo + 2 Refrescos grandes + Nachos con queso',
    price: 15.99,
    image: '/images/combo2.jpg',
    quantity: 0,
    category: 'combo'
  },
  {
    id: 3,
    name: 'Combo Nebulosa Familiar',
    description: 'Palomitas jumbo + 4 Refrescos grandes + 2 Hot Dogs + Tequeños',
    price: 24.99,
    image: '/images/combo3.jpg',
    quantity: 0,
    category: 'combo'
  }
];

const drinks: Product[] = [
  {
    id: 101,
    name: 'Pepsi Orbital',
    description: 'Refresco Pepsi',
    price: 3.99,
    image: '/images/pepsi.jpg',
    size: 'M',
    category: 'drinks',
    quantity: 0
  },
  {
    id: 102,
    name: 'Seven Up Estelar',
    description: 'Refresco Seven Up',
    price: 3.99,
    image: '/images/7up.jpg',
    size: 'M',
    category: 'drinks',
    quantity: 0
  },
  {
    id: 103,
    name: 'Malta Planetaria',
    description: 'Malta Regional',
    price: 3.99,
    image: '/images/malta.jpg',
    size: 'M',
    category: 'drinks',
    quantity: 0
  },
  {
    id: 104,
    name: 'Hit Cósmico',
    description: 'Jugo Hit de Frutas',
    price: 3.99,
    image: '/images/hit.jpg',
    size: 'M',
    category: 'drinks',
    quantity: 0
  }
];

const snacks: Product[] = [
  {
    id: 201,
    name: 'Tequeños Meteoro',
    description: 'Pack de 6 tequeños con salsa',
    price: 5.99,
    image: '/images/tequenos.jpg',
    category: 'snacks',
    quantity: 0
  },
  {
    id: 202,
    name: 'Nachos Constelación',
    description: 'Nachos con queso y guasacaca',
    price: 6.99,
    image: '/images/nachos.jpg',
    category: 'snacks',
    quantity: 0
  },
  {
    id: 203,
    name: 'Hot Dog Espacial',
    description: 'Hot dog con papitas y salsas',
    price: 5.99,
    image: '/images/hotdog.jpg',
    category: 'snacks',
    quantity: 0
  },
  {
    id: 204,
    name: 'Empanadas Satélite',
    description: 'Empanadas de queso o carne',
    price: 4.99,
    image: '/images/empanadas.jpg',
    category: 'snacks',
    quantity: 0
  }
];

const popcorn: Product[] = [
  {
    id: 301,
    name: 'Palomitas Polvo Estelar',
    description: 'Palomitas de maíz con mantequilla',
    price: 4.99,
    image: '/images/popcorn-small.jpg',
    size: 'S',
    category: 'popcorn',
    quantity: 0
  },
  {
    id: 302,
    name: 'Palomitas Cometa',
    description: 'Palomitas de maíz con mantequilla',
    price: 5.99,
    image: '/images/popcorn-medium.jpg',
    size: 'M',
    category: 'popcorn',
    quantity: 0
  },
  {
    id: 303,
    name: 'Palomitas Supernova',
    description: 'Palomitas de maíz con mantequilla',
    price: 7.99,
    image: '/images/popcorn-large.jpg',
    size: 'L',
    category: 'popcorn',
    quantity: 0
  },
  {
    id: 304,
    name: 'Palomitas Agujero Negro',
    description: 'Palomitas de maíz con caramelo',
    price: 8.99,
    image: '/images/popcorn-caramel.jpg',
    size: 'L',
    category: 'popcorn',
    quantity: 0
  }
];

const SnackBarMenu: React.FC<SnackBarMenuProps> = ({ mode, onCombosSelected, showOnlyInBooking }) => {
  const [selectedCombos, setSelectedCombos] = useState<Combo[]>(combos);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    ...drinks,
    ...snacks,
    ...popcorn
  ]);

  const handleQuantityChange = (productId: number, increment: boolean) => {
    const updatedProducts = selectedProducts.map(product => {
      if (product.id === productId) {
        const newQuantity = increment ? (product.quantity || 0) + 1 : Math.max(0, (product.quantity || 0) - 1);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });

    setSelectedProducts(updatedProducts);

    // Actualizar combos si es necesario
    const updatedCombos = selectedCombos.map(combo => {
      if (combo.id === productId) {
        const newQuantity = increment ? combo.quantity + 1 : Math.max(0, combo.quantity - 1);
        return { ...combo, quantity: newQuantity };
      }
      return combo;
    });

    setSelectedCombos(updatedCombos);
    onCombosSelected?.(updatedCombos.filter(combo => combo.quantity > 0));
  };

  if (!showOnlyInBooking) {
    return null;
  }

  const renderProductSection = (title: string, products: Product[]) => (
    <>
      <SectionTitle currentTheme={mode}>{title}</SectionTitle>
      <Grid>
        {products.map((product) => (
          <ProductCard key={product.id} isSelected={(product.quantity || 0) > 0}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>
            {product.size && <ProductSize>Tamaño: {product.size}</ProductSize>}
            <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
            <QuantityControl>
              <QuantityButton
                onClick={() => handleQuantityChange(product.id, false)}
                disabled={(product.quantity || 0) === 0}
              >
                -
              </QuantityButton>
              <QuantityText>{product.quantity || 0}</QuantityText>
              <QuantityButton
                onClick={() => handleQuantityChange(product.id, true)}
              >
                +
              </QuantityButton>
            </QuantityControl>
            {(product.quantity || 0) > 0 && (
              <SelectedBadge>
                <span>✓</span> Producto seleccionado
              </SelectedBadge>
            )}
          </ProductCard>
        ))}
      </Grid>
    </>
  );

  return (
    <MainContent>

      {renderProductSection('Combos Galácticos', combos)}
      {renderProductSection('Palomitas Estelares', popcorn)}
      {renderProductSection('Bebidas Cósmicas', drinks)}
      {renderProductSection('Snacks Interestelares', snacks)}
    </MainContent>
  );
};

const SectionTitle = styled.h2<ThemeProps>`
  color: ${(props: ThemeProps) => props.currentTheme === 'dark' ? '#ffffff' : '#4a4a4a'};
  margin: 2rem 0 1rem;
  text-align: center;
  font-size: 1.5rem;
`;

const ProductSize = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
`;

// Exportamos el componente SnackBarMenu como default y también como SnackBar para mantener compatibilidad
export { SnackBarMenu as default, SnackBarMenu as SnackBar }; 