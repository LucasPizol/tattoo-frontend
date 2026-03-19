import styles from "./styles.module.scss";

export const OrderSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* Layout principal com sidebar */}
      <div className={styles.mainLayout}>
        <div className={styles.contentSection}>
          {/* Seção Cliente */}
          <div className={styles.clientSection}>
            <div className={`${styles.skeletonItem} ${styles.sectionLabel}`} />
            <div className={styles.clientCard}>
              <div className={`${styles.skeletonItem} ${styles.clientName}`} />
              <div className={`${styles.skeletonItem} ${styles.clientDetail}`} />
            </div>
          </div>

          {/* Seção Pagamento */}
          <div className={styles.paymentSection}>
            <div className={`${styles.skeletonItem} ${styles.sectionLabel}`} />
            <div className={styles.paymentCard}>
              <div className={styles.paymentRow}>
                <div
                  className={`${styles.skeletonItem} ${styles.paymentLabel}`}
                />
                <div
                  className={`${styles.skeletonItem} ${styles.paymentValue}`}
                />
              </div>
              <div className={styles.paymentRow}>
                <div
                  className={`${styles.skeletonItem} ${styles.paymentLabel}`}
                />
                <div
                  className={`${styles.skeletonItem} ${styles.paymentValue}`}
                />
              </div>
              <div
                className={`${styles.skeletonItem} ${styles.paymentInput}`}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.summaryRow}>
              <div
                className={`${styles.skeletonItem} ${styles.summaryLabel}`}
              />
              <div
                className={`${styles.skeletonItem} ${styles.summaryValue}`}
              />
            </div>
            <div className={styles.summaryRow}>
              <div
                className={`${styles.skeletonItem} ${styles.summaryLabel}`}
              />
              <div
                className={`${styles.skeletonItem} ${styles.summaryValue}`}
              />
            </div>
            <div className={styles.summaryRow}>
              <div
                className={`${styles.skeletonItem} ${styles.summaryLabel}`}
              />
              <div
                className={`${styles.skeletonItem} ${styles.summaryValue}`}
              />
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <div className={`${styles.skeletonItem} ${styles.totalLabel}`} />
              <div className={`${styles.skeletonItem} ${styles.totalValue}`} />
            </div>

            <div className={`${styles.skeletonItem} ${styles.buttonSkeleton}`} />
          </div>
        </div>
      </div>

      {/* Seção Produtos */}
      <div className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <div className={`${styles.skeletonItem} ${styles.productsTitle}`} />
          <div className={`${styles.skeletonItem} ${styles.addButton}`} />
        </div>

        <div className={styles.productsTable}>
          <div className={styles.tableHeader}>
            <div
              className={`${styles.skeletonItem} ${styles.tableHeaderCell}`}
            />
            <div
              className={`${styles.skeletonItem} ${styles.tableHeaderCell}`}
            />
            <div
              className={`${styles.skeletonItem} ${styles.tableHeaderCell}`}
            />
            <div
              className={`${styles.skeletonItem} ${styles.tableHeaderCell}`}
            />
            <div
              className={`${styles.skeletonItem} ${styles.tableHeaderCell}`}
            />
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.tableRow}>
              <div className={`${styles.skeletonItem} ${styles.productImage}`} />
              <div className={styles.productInfo}>
                <div className={`${styles.skeletonItem} ${styles.productName}`} />
                <div
                  className={`${styles.skeletonItem} ${styles.productMaterial}`}
                />
              </div>
              <div className={`${styles.skeletonItem} ${styles.productQty}`} />
              <div className={`${styles.skeletonItem} ${styles.productValue}`} />
              <div className={`${styles.skeletonItem} ${styles.productTotal}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
