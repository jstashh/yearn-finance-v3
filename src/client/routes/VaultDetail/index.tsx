import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { TokensSelectors, VaultsSelectors } from '@store';
import { useAppSelector } from '@hooks';
import { formatPercent, normalizeUsdc } from '@src/utils';
import { TokenIcon, ViewContainer } from '@components/app';
import { DepositTx, WithdrawTx } from '@components/app/Transactions';
import { Card, CardContent, CardHeader, SpinnerLoading, Tab, TabPanel, Tabs, Text, Button } from '@components/common';
import { LineChart } from '@components/common/Charts';
import { useEffect } from 'react';

const StyledLineChart = styled(LineChart)`
  margin-top: 2.4rem;
`;

const VaultChart = styled(Card)`
  flex: 1 100%;
  width: 100%;
`;

const StyledCardContent = styled(CardContent)`
  margin-top: 0.4rem;
`;

const StyledCardHeader = styled(CardHeader)`
  padding: 0;
`;

const StyledTabPanel = styled(TabPanel)`
  margin-top: 1.5rem;
`;

const ActionsTabs = styled(Tabs)`
  margin-top: 1.2rem;
`;

const VaultActions = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 41.6rem;
  align-self: stretch;
`;

const OverviewInfo = styled(Card)`
  padding: ${({ theme }) => theme.cardPadding};
`;

const StyledText = styled(Text)`
  color: ${(props) => props.theme.colors.secondary};
`;

const InfoValueRow = styled.div`
  display: grid;
  grid-template-columns: 9.6rem 1fr;
  grid-gap: 0.6rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.onSurfaceSH1};
  font-size: 1.4rem;
`;

const InfoValueTitle = styled(Text)`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: ${(props) => props.theme.colors.secondary};
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TokenLogo = styled(Card)`
  padding: 2.2rem;
  height: min-content;
`;

const OverviewTokenInfo = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-gap: 4.7rem;
`;

const VaultOverview = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;

  > * {
    margin-top: ${({ theme }) => theme.cardPadding};
  }
`;

const VaultDetailView = styled(ViewContainer)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const BackButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.onSurfaceH2};
`;

export interface VaultDetailRouteParams {
  vaultAddress: string;
}

export const VaultDetail = () => {
  // const { t } = useAppTranslation('common');
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState('deposit');

  const selectedVault = useAppSelector(VaultsSelectors.selectSelectedVault);
  const vaultsStatus = useAppSelector(VaultsSelectors.selectVaultsStatus);
  const tokensStatus = useAppSelector(TokensSelectors.selectWalletTokensStatus);

  const [firstTokensFetch, setFirstTokensFetch] = useState(false);
  const [tokensInitialized, setTokensInitialized] = useState(false);

  useEffect(() => {
    const loading = tokensStatus.loading;
    if (loading && !firstTokensFetch) setFirstTokensFetch(true);
    if (!loading && firstTokensFetch) setTokensInitialized(true);
  }, [tokensStatus.loading]);

  const [firstVaultsFetch, setFirstVaultsFetch] = useState(false);
  const [vaultsInitialized, setVaultsInitialized] = useState(false);

  useEffect(() => {
    const loading = vaultsStatus.loading;
    if (loading && !firstVaultsFetch) setFirstVaultsFetch(true);
    if (!loading && firstVaultsFetch) setVaultsInitialized(true);
  }, [vaultsStatus.loading]);

  const generalLoading = (vaultsStatus.loading || tokensStatus.loading) && (!tokensInitialized || !vaultsInitialized);

  const handleTabChange = (selectedTab: string) => {
    setSelectedTab(selectedTab);
  };

  const data = [
    {
      id: 'japan',
      // color: '#d9269a',
      data: [
        { x: '2019-05-01', y: 2 },
        { x: '2019-06-01', y: 7 },
        { x: '2019-06-15', y: 17 },
        { x: '2019-06-23', y: 1 },
        { x: '2019-08-01', y: 42 },
        { x: '2019-09-01', y: 1 },
      ],
    },
  ];

  return (
    <ViewContainer>
      <BackButton onClick={() => history.push(`/vaults`)}>Back to Vaults Page</BackButton>

      {generalLoading && <SpinnerLoading flex="1" width="100%" height="100%" />}

      {!generalLoading && selectedVault && (
        <VaultDetailView>
          <VaultOverview>
            <StyledCardHeader header="Overview" />

            <OverviewTokenInfo>
              <TokenLogo variant="background">
                <TokenIcon icon={selectedVault.token.icon} symbol={selectedVault.token.name} size="xBig" />
              </TokenLogo>

              <TokenInfo>
                <InfoValueTitle>{selectedVault?.displayName}</InfoValueTitle>

                <InfoValueRow>
                  <span>APY</span>
                  <StyledText fontWeight="bold">{formatPercent(selectedVault.apyData, 2)}</StyledText>
                </InfoValueRow>
                <InfoValueRow>
                  <span>Total Assets</span>
                  <StyledText ellipsis>{normalizeUsdc(selectedVault.vaultBalanceUsdc, 0)}</StyledText>
                </InfoValueRow>
                <InfoValueRow>
                  <span>Type</span>
                  <StyledText ellipsis>{selectedVault.token.categories}</StyledText>
                </InfoValueRow>
                <InfoValueRow>
                  <span>Website</span>
                  <StyledText ellipsis>{selectedVault.token.website}</StyledText>
                </InfoValueRow>
              </TokenInfo>
            </OverviewTokenInfo>

            {selectedVault.token.description && (
              <OverviewInfo variant="surface" cardSize="small">
                <StyledCardHeader subHeader="About" />
                <StyledCardContent>{selectedVault.token.description}</StyledCardContent>
              </OverviewInfo>
            )}

            <OverviewInfo variant="surface" cardSize="small">
              <StyledCardHeader subHeader="Strategies" />
              <StyledCardContent>
                This vault supplies the {selectedVault.displayName} on Compound and borrows an additional amount of{' '}
                {selectedVault.displayName} to maximize COMP farming. ( 1 of 9 )
              </StyledCardContent>
            </OverviewInfo>
          </VaultOverview>

          <VaultActions>
            <StyledCardHeader header="Transactions" />

            <ActionsTabs value={selectedTab} onChange={handleTabChange}>
              <Tab value="deposit">Invest</Tab>
              <Tab value="withdraw">Withdraw</Tab>
            </ActionsTabs>

            <StyledTabPanel value="deposit" tabValue={selectedTab}>
              <DepositTx />
            </StyledTabPanel>
            <StyledTabPanel value="withdraw" tabValue={selectedTab}>
              <WithdrawTx />
            </StyledTabPanel>
          </VaultActions>

          <VaultChart>
            <StyledCardHeader header="Performance" />
            <StyledLineChart chartData={data} tooltipLabel="Earning Over Time" />
          </VaultChart>
        </VaultDetailView>
      )}
    </ViewContainer>
  );
};
