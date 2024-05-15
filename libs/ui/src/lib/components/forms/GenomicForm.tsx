import React, {CSSProperties, useContext, useEffect, useRef, useState} from "react";
import Form, {withTheme} from "@rjsf/core";
import {RegistryWidgetsType, ValidationData} from "@rjsf/utils";
import {useDispatch} from "react-redux";
import CtimsMatchDialogObjectFieldTemplate from "../../custom-rjsf-templates/CtimsMatchDialogObjectFieldTemplate";
import {
  deleteMatchDialogError,
  formChange,
  operatorChange,
  setMatchDialogErrors
} from "../../../../../../apps/web/store/slices/modalActionsSlice";
import {OperatorDropdown} from "./OperatorDropdown";
import {TitleContainer} from "./TitleContainer";
import {JSONSchema7} from "json-schema";
import localValidator from "@rjsf/validator-ajv8";
import {IFormProps} from "../MatchingMenuAndForm";
import {Theme as PrimeTheme} from "../../primereact";
import CtimsFieldTemplate from "../../custom-rjsf-templates/CtimsFieldTemplate";
import CtimsErrorListTemplate from "../../custom-rjsf-templates/CtimsErrorListTemplate";
import CtimsInput from "../../custom-rjsf-templates/CtimsInput";
import CtimsDropdown from "../../custom-rjsf-templates/CtimsDropdown";
import {CtimsDialogContext, CtimsDialogContextType} from "../CtimsMatchDialog";
import { Checkbox } from 'primereact/checkbox';
import {wildcard_protein_change_validation_func, getCurrentOperator, protein_change_validation_func} from "../helpers";
import AutocompleteField from "../CtimsAutoCompleteComponent";


const RjsfForm = withTheme(PrimeTheme)

const formTemplates = {
  FieldTemplate: CtimsFieldTemplate,
  ErrorListTemplate: CtimsErrorListTemplate,
}

const widgets: RegistryWidgetsType = {
  TextWidget: CtimsInput,
  SelectWidget: CtimsDropdown
}

const formContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'scroll'
}

// const matchAllContainerStyle: CSSProperties = {
//   marginLeft: '20px',
//   marginTop: '16px',
//   marginBottom: '16px'
// }

export const GenomicForm = (props: IFormProps) => {
  const {node, rootNodes} = props
  const nk = node.key as string;
  // console.log('GenomicForm node: ', node)

  const {setSaveBtnState} = useContext(CtimsDialogContext) as CtimsDialogContextType;

  const genomicFormRef = useRef<any>(null);

  useEffect(() => {
    node.data.formValid = false;
  }, [node]);

  const dispatch = useDispatch()

  const genomicFormSchema = {
    'definitions': {
      'hugo_symbol': {
        type: 'string',
      },
      "variant_category": {
        "enumNames": [
          " ",
          "Mutation",
          "Not Mutated (Surrogate for Wildtype)",
          "Copy Number Variation",
          "Structural Variation",
          // "Wildtype",
          "Signature"
        ],
        "enum": [
          "",
          "Mutation",
          "!Mutation",
          "CNV",
          "Structural Variation",
          // "WT",
          "Signature"
        ]
      },
      'variant_classification': {
        "enumNames": [
          " ",
          "Frame Shift Del",
          "Frame Shift Ins",
          "In Frame Del",
          "In Frame Ins",
          "Missense Mutation",
          "Nonesense Mutation",
          "Splice Site",
          "Translation Start Site",
          "Nonstop Mutation",
          "RNA",
          "Targeted Region",
          "De Novo Start In Frame",
          "De Novo Start Out of Frame",
          "Splice Region",
          "Unknown",
        ],
        "enum": [
          "",
          "Frame_Shift_Del",
          "Frame_Shift_Ins",
          "In_Frame_Del",
          "In_Frame_Ins",
          "Missense_Mutation",
          "Nonsense_Mutation",
          "Splice_Site",
          "Translation_Start_Site",
          "Nonstop_Mutation",
          "RNA",
          "Targeted_Region",
          "De_novo_Start_InFrame",
          "De_novo_Start_OutOfFrame",
          "Splice_Region",
          "Unknown"
        ]
      },
      'cnv_call': {
        "enumNames": [
          " ",
          "Heterozygous deletion",
          "Homozygous deletion",
          "Gain",
          "High level amplification",
        ],
        "enum": [
          "",
          "Heterozygous deletion",
          "Homozygous deletion",
          "Gain",
          "High level amplification",
        ]
      },
      'wildtype': {
        "enumNames": [
          " ",
          "True",
          "False",
        ],
        "enum": [
          "",
          "True",
          "False"
        ]
      },
      'pole_status': {
        "enumNames": [
          " ",
          "Yes",
          "No",
          "Cannot Access",
          "Insufficient Variants",
        ],
        "enum": [
          "",
          "yes",
          "no",
          "cannot_access",
          "insufficient_variants",
        ],
      },
      'uva_status': {
        "enumNames": [
          " ",
          "Yes",
          "No",
          "Cannot Access",
          "Insufficient Variants",
        ],
        "enum": [
          "",
          "yes",
          "no",
          "cannot_access",
          "insufficient_variants",
        ],
      },
      'tobacco_status': {
        "enumNames": [
          " ",
          "Yes",
          "No",
          "Cannot Access",
          "Insufficient Variants",
        ],
        "enum": [
          "",
          "yes",
          "no",
          "cannot_access",
          "insufficient_variants",
        ],
      },
      'apobec_status': {
        "enumNames": [
          " ",
          "Yes",
          "No",
          "Cannot Access",
          "Insufficient Variants",
        ],
        "enum": [
          "",
          "yes",
          "no",
          "cannot_access",
          "insufficient_variants",
        ],
      },
      'temozolomide_status': {
        "enumNames": [
          " ",
          "Yes",
          "No",
          "Cannot Access",
          "Insufficient Variants",
        ],
        "enum": [
          "",
          "yes",
          "no",
          "cannot_access",
          "insufficient_variants",
        ],
      },
      'mmr_status': {
        "enumNames": [
          " ",
          "MMR-Proficient",
          "MMR-Deficient"
        ],
        "enum": [
          "",
          "MMR-Proficient",
          "MMR-Deficient",
        ]
      },
      "ms_status": {
        "enumNames": [
          " ",
          "MSI-H",
          "MSI-L",
          "MSS"
        ],
        "enum": [
          "",
          "MSI-H",
          "MSI-L",
          "MSS",
        ]
      },
      "molecular_function": {
        "enumNames": [
          " ",
          "Activating",
          "Inactivating"
          ],
        "enum": [
          "",
          "Activating",
          "Inactivating"
        ]
      }
    },
    'type': 'object',
    'required': [],
    'properties': {
      "variantCategoryContainerObject": {
        'title': '',
        'type': 'object',
        'properties': {
          "variant_category": {
            "$ref": "#/definitions/variant_category",
            'title': 'Variant Category',
            "description": "Type of alteration",
          },
        },
        "dependencies": {
          "variant_category": {
            "allOf": [
              {
                "if": {
                  "properties": {
                    "variant_category": {
                      "const": "Mutation"
                    }
                  }
                },
                "then": {
                  "properties": {
                    'hugo_symbol': {
                      "$ref": "#/definitions/hugo_symbol",
                      'title': 'Hugo Symbol',
                      "description": "Gene symbol as determined by https://www.genenames.org/",
                    },
                    'protein_change': {
                      'type': 'string',
                      'title': 'Protein Change',
                      "description": "Curate a specific protein change (must be in the correct format ex. p.V600E, p.E684_E686del, p.G29_T35delinsA, p.X893_splice, p.L281_H282insAAR, p.L28Ifs*30, p.P162_D166dup)",
                    },
                    'wildcard_protein_change': {
                      'type': 'string',
                      'title': 'Wildcard Protein Change',
                      "description": "Curate variations of a protein change (must be in the correct format ex. p.T70). This allows matching of any mutation at this site. ",
                    },
                    'true_transcript_exon': {
                      'type': 'string',
                      'title': 'True Transcript Exon',
                      "description": "Curate mutations in a specific exon",
                    },
                    'variant_classification': {
                      "$ref": "#/definitions/variant_classification",
                      'title': 'Variant Classification',
                      "description": "Curate a particular type of mutation",
                    },
                    "molecular_function": {
                      "$ref": "#/definitions/molecular_function",
                      'title': 'Molecular Function',
                      "description": "Refers to tasks or activities characteristic of gene",
                    }
                  },
                  "required": []
                }
              },
              {
                "if": {
                  "properties": {
                    "variant_category": {
                      "const": "!Mutation"
                    }
                  }
                },
                "then": {
                  "properties": {
                    'hugo_symbol': {
                      "$ref": "#/definitions/hugo_symbol",
                      'title': 'Hugo Symbol',
                      "description": "Gene symbol as determined by https://www.genenames.org/",
                    }
                  },
                  "required": []
                }
              },
              {
                "if": {
                  "properties": {
                    "variant_category": {
                      "const": "CNV"
                    }
                  }
                },
                "then": {
                  "properties": {
                    'hugo_symbol': {
                      "$ref": "#/definitions/hugo_symbol",
                      'title': 'Hugo Symbol',
                      "description": "Gene symbol as determined by https://www.genenames.org/",
                    },
                    'cnv_call': {
                      'title': 'CNV Call',
                      '$ref': '#/definitions/cnv_call',
                      "description": "Specify the type of copy number variation",
                    },
                    "molecular_function": {
                      "$ref": "#/definitions/molecular_function",
                      'title': 'Molecular Function',
                      "description": "Refers to tasks or activities characteristic of gene",
                    }
                  },
                  "required": []
                }
              },
              {
                "if": {
                  "properties": {
                    "variant_category": {
                      "const": "Structural Variation"
                    }
                  }
                },
                "then": {
                  "properties": {
                    'hugo_symbol': {
                      "$ref": "#/definitions/hugo_symbol",
                      'title': 'Hugo Symbol',
                      "description": "Gene symbol as determined by https://www.genenames.org/",
                    },
                    'fusion_partner_hugo_symbol': {
                      'type': 'string',
                      'title': 'Fusion Partner Hugo Symbol',
                      "description": "Curate the partner gene in a fusion",
                    },
                    "molecular_function": {
                      "$ref": "#/definitions/molecular_function",
                      'title': 'Molecular Function',
                      "description": "Refers to tasks or activities characteristic of gene",
                    }
                  },
                  "required": []
                }
              },
              {
                "if": {
                  "properties": {
                    "variant_category": {
                      "const": "Signature"
                    }
                  }
                },
                "then": {
                  "properties": {
                    // 'mmr_status': {
                    //   'title': 'MMR Status',
                    //   '$ref': '#/definitions/mmr_status',
                    //   "description": "Curate a specific mismatch repair status",
                    // },
                    'ms_status': {
                      'title': 'MS Status',
                      '$ref': '#/definitions/ms_status',
                      "description": "Curate a specific microsatellite stability status",
                    },
                    'pole_status': {
                      'title': 'POLE Status',
                      '$ref': '#/definitions/pole_status',
                      "description": "Curate for trials requiring a specific POLE signature status",
                    },
                    'uva_status': {
                      'title': 'UVA Status',
                      '$ref': '#/definitions/uva_status',
                      "description": "Curate for trials requiring a specific UVA signature status",
                    },
                    'tobacco_status': {
                      'title': 'Tobacco Status',
                      '$ref': '#/definitions/tobacco_status',
                      "description": "Curate for trials requiring a specific tobacco signature status",
                    },
                    'apobec_status': {
                      'title': 'APOBEC Status',
                      '$ref': '#/definitions/apobec_status',
                      "description": "Curate for trials requiring a specific APOBEC signature status",
                    },
                    'temozolomide_status': {
                      'title': 'Temozolomide Status',
                      '$ref': '#/definitions/temozolomide_status',
                      "description": "Curate for trials requiring a specific temozolomide signature status",
                    },
                  },
                  "required": []
                }
              },
            ]
          }
        },
        "required": ['variant_category']
      },
      // 'wildtype': {
      //   'title': 'Wildtype',
      //   '$ref': '#/definitions/wildtype',
      //   "description": "An indication of whether an eligibility criteria requires a gene to be wildtype.",
      // },
    }
  };
  const genomicUiSchema = {
    "ui:ObjectFieldTemplate": CtimsMatchDialogObjectFieldTemplate,
    "ui:submitButtonOptions": {
      "norender": true,
    },
    "variantCategoryContainerObject": {
      "hugo_symbol": {
        "ui:widget": AutocompleteField,
      }
    }
  }

  const validateFormFromRef = (data?: any) => {
    const form: Form = genomicFormRef.current;
    form?.validateForm();
    let errorDetails: ValidationData<any>;
    if (data) {
      errorDetails = form?.validate(data.formData);
    } else {
      errorDetails = form?.validate(form.state.formData);
    }
    // console.log('onFormChange errorDetails: ', errorDetails);
    if (errorDetails?.errors.length > 0) {
      errorsInFormDispatch();
    }
    if (errorDetails?.errors.length === 0) {
      noErrorsInFormDispatch();
    }
  }

  const noErrorsInFormDispatch = () => {
    node.data.formValid = true;
    dispatch(deleteMatchDialogError(nk));
    setSaveBtnState(false)
  }

  const errorsInFormDispatch = () => {
    node.data.formValid = false;
    const payload = {[nk]: true};
    dispatch(setMatchDialogErrors(payload));
  }

  const onFormChange = (data: any) => {
    const flattenedFormData = {
      ...data,
      // formData: data.formData.variantCategoryContainerObject, /*can't change this, otherwise form won't render*/
      errorSchema: data.errorSchema.variantCategoryContainerObject,
    }
    validateFormFromRef(flattenedFormData);

    node.data.formData = flattenedFormData.formData;
    dispatch(formChange());
    console.log('onFormChange node: ', node)
  }

  const onOperatorChange = (code: string) => {
    const codeLowerCase = code.toLowerCase();
    dispatch(operatorChange({operator: codeLowerCase, nodeKey: node.key as string, location: 'form'}));
  }

  /**
   * This function is used to get the current operator for the node.
   */
  const useCurrentOperator = () => {
    return getCurrentOperator(rootNodes, node);
  }

  const customValidate = (formData: any, errors: any, uiSchema: any) => {
    console.log('form data:', formData)
    console.log('errors:', errors)
    let myFormData = formData;
    let myErrors = errors;
    if (formData.variantCategoryContainerObject) {
      myFormData = formData.variantCategoryContainerObject;
      myErrors = errors.variantCategoryContainerObject;
    }

    if (typeof myFormData.hugo_symbol === 'undefined' &&
        typeof myFormData.variant_category === 'undefined' &&
        typeof myFormData.protein_change === 'undefined' &&
        typeof myFormData.wildcard_protein_change === 'undefined' &&
        typeof myFormData.molecular_function === 'undefined' &&
        typeof myFormData.variant_classification === 'undefined' &&
        typeof myFormData.cnv_call === 'undefined' &&
        typeof myFormData.fusion_partner_hugo_symbol === 'undefined' &&
        typeof myFormData.true_transcript_exon === 'undefined' &&
        // typeof myFormData.wildtype === 'undefined' &&
        typeof myFormData.pole_status === 'undefined' &&
        typeof myFormData.uva_status === 'undefined' &&
        typeof myFormData.tobacco_status === 'undefined' &&
        typeof myFormData.apobec_status === 'undefined' &&
        typeof myFormData.temozolomide_status === 'undefined' &&
        // typeof myFormData.mmr_status === 'undefined' &&
        typeof myFormData.ms_status === 'undefined') {
      myErrors.variant_category.addError('Must have at least one field filled.');
    }
    if (!wildcard_protein_change_validation_func(formData.wildcard_protein_change)) {
      myErrors.wildcard_protein_change.addError('Must be in the form of p.A1');
    }
    if (!protein_change_validation_func(formData.protein_change)) {
      myErrors.protein_change.addError('Must start with p.');
    }
    if (formData.protein_change && formData.wildcard_protein_change) {
      myErrors.protein_change.addError('Cannot have both protein change and wildcard protein change filled.');
      myErrors.wildcard_protein_change.addError('Cannot have both protein change and wildcard protein change filled.');
    }
    // console.log('custom validate errors: ', errors)

    return myErrors;
  }

  return (
    <div style={formContainerStyle}>
      <OperatorDropdown
        onOperatorChange={onOperatorChange}
        getCurrentOperator={useCurrentOperator}
        selectedNode={node} />
      <div>
        <TitleContainer title="Genomic" isAddEnabled node={node} />
      </div>
      <div>
        {/*<div style={matchAllContainerStyle}>*/}
        {/*  <Checkbox inputId="matchAllChkb" onChange={e => setMatchAllChecked(e.checked)} checked={matchAllChecked}></Checkbox>*/}
        {/*  <label htmlFor="matchAllChkb" style={{marginLeft: '10px'}}>Match with all available genomic criteria</label>*/}
        {/*</div>*/}
        <RjsfForm ref={genomicFormRef}
                  schema={genomicFormSchema as JSONSchema7}
                  templates={formTemplates}
                  formData={node.data.formData}
                  uiSchema={genomicUiSchema}
                  widgets={widgets}
                  onChange={onFormChange}
                  onError={() => {console.log('onError')}}
                  customValidate={customValidate}
                  validator={localValidator}/>
      </div>
    </div>
  )
}
