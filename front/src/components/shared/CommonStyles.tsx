import styled from 'styled-components';

export interface ThemeProps {
  currentTheme: 'light' | 'dark';
}

export interface CardProps extends ThemeProps {
  isSelected?: boolean;
}

export const Container = styled.div<ThemeProps>`
  min-height: 100vh;
  padding: 2rem;
  background: ${({ currentTheme }: ThemeProps) => currentTheme === 'dark' ? '#0B1622' : '#F5F5F5'};
  color: ${({ currentTheme }: ThemeProps) => currentTheme === 'dark' ? '#fff' : '#0B1622'};
`;

export const Title = styled.h1<ThemeProps>`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${({ currentTheme }: ThemeProps) => currentTheme === 'dark' ? '#fff' : '#0B1622'};
  text-align: center;
`;

export const Subtitle = styled.h2<ThemeProps>`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: ${({ currentTheme }: ThemeProps) => currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666'};
  text-align: center;
`;

export const Card = styled.div<CardProps>`
  background: ${({ currentTheme }: CardProps) => currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: ${({ isSelected, currentTheme }: CardProps) => 
    isSelected 
      ? '2px solid#41e1e100'
      : currentTheme === 'dark'
      ? '2px solid transparent'
      : '2px solid rgba(11, 22, 34, 0.1)'
  };
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ currentTheme }: CardProps) => 
      currentTheme === 'dark' 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
        : '0 8px 32px rgba(0, 0, 0, 0.1)'
    };
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Feature = styled.div<ThemeProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ currentTheme }: ThemeProps) => currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666'};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

export const BackButton = styled.button<ThemeProps>`
  background: none;
  border: none;
  color: ${({ currentTheme }: ThemeProps) => currentTheme === 'dark' ? '#41E1E1' : '#0B1622'};
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  
  &:hover {
    opacity: 0.8;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const FeatureCard = styled.div<CardProps>`
  ${Card}
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${({ currentTheme }: CardProps) => currentTheme === 'dark' ? '#41E1E1' : '#0B1622'};
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${({ currentTheme }: CardProps) => currentTheme === 'dark' ? '#fff' : '#0B1622'};
  }
`;

export const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #FF1493, #4169E1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const FeatureTitle = styled.h3<ThemeProps>`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ currentTheme }: ThemeProps) => currentTheme === 'dark' ? '#fff' : '#1a1a1a'};
`;

export const FeatureDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`; 