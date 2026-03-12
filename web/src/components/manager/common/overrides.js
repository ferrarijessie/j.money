export const buttonGridOverrides = {
    overrides: {
        Block: {
            style: {
                display: 'flex',
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                paddingBottom: '5px',
                gap: '10px'
            }
        }
    }
};

export const headingOverrides = {
    marginBottom: '15px',
    marginTop: '15px',
};

export const subHeadingOverrides = {
    marginBottom: '5px',
};

export const headingGridOverrides = {
    overrides: {
        Block: {
            style : {
                borderBottom: '1px solid #eeeeee',
                padding: '0px 15px',
            }
        }
    }
};

export const subHeadingGridOverrides = {
    overrides: {
        Block: {
            style : {
                borderBottom: '1px solid #eeeeee',
                marginBottom: '30px',
            }
        }
    }
};

export const detailsGridOverrides = {
    overrides: {
        Block: {
            style: {
                textAlign: 'center',
                border: '1px solid #eeeeee',
                padding: '10px',
                marginBottom: '20px',
            }
        }
    }
};

export const sideMenuGridOverrides = {
    overrides: {
        Block: {
            style : {
                width: '230px',
                flexGrow: 'inherit',
                borderRight: '1px solid #eeeeee',
                borderLeft: '1px solid #eeeeee',
                borderBottom: '1px solid #eeeeee',
            }
        }
    }
};

export const childrenGridOverrides = {
    overrides: {
        Block: {
            style : {
                padding: '0px 20px 50px 20px',
                borderRight: '1px solid #eeeeee',
                borderBottom: '1px solid #eeeeee',
            }
        }
    }
};

export const bodyGridOverrides = {
    overrides: {
        Block: {
            style : {
                height: '100%'
            }
        }
    }
};

export const listHeadingOverrides = {
    overrides: {
        Root: {
            style: {
                borderBottom: '1px solid #eeeeee',
            }
        }
    }
};

export const listItemOverrides = {
    overrides: {
        Root: {
            style: {
                height: '25px',
                padding: '5px',
                borderBottom: '1px dotted #eeeeee',
            }
        }
    }
};

export const managerSummaryGridOverrides = {
    overrides: {
        Block: {
            style: {
                borderTop: '1px solid #eeeeee',
                padding: '10px 0px'
            }
        }
    }
};

export const managerFilterGridOverrides = {
    overrides: {
        Block: {
            style: {
                marginBottom: "20px",
            }
        }
    }
};

export const filterItemsOverrides = {
    overrides: {
        Block: {
            style: {
                padding: "0px 5px",
                width: "24%"
            }
        }
    }
};

export const actionItemOverrides = {
    overrides: {
        Block: {
            style: {
                gap: '5px',
                display: 'flex',
                justifyContent: 'flex-end'
            }
        }
    }
};

export const typesTableOverrides = {
    TableBodyRow: {
      style: ({ $theme, $rowIndex }) => ({
        backgroundColor:
          $rowIndex % 2
            ? $theme.colors.backgroundPrimary
            : $theme.colors.backgroundSecondary,
        ":hover": {
          backgroundColor: $theme.colors.backgroundTertiary,
        },
      }),
    },
    Root: {
        style: {
            height: '650px'
        }
    }
};
