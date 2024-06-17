from langchain_core import runnables
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import BaseOutputParser
import pandas as pd
from pandas._libs.missing import NAType
from typing import Union


class BooleanOutputParser(BaseOutputParser[Union[bool, NAType]]):
    """Custom boolean parser."""

    true_val: str = "YES"
    false_val: str = "NO"

    def parse(self, text: str) -> Union[bool, NAType]:
        cleaned_text = text.strip().upper()
        if self.true_val in cleaned_text:
            return True
        elif self.false_val in cleaned_text:
            return False
        return pd.NA

    @property
    def _type(self) -> str:
        return "boolean_output_parser"


class Matcher:
    def __init__(self):
        # Build up the LangChain chain for handling the matching
        prompt_template = self._get_prompt_template()
        model = self._get_model()
        output_parser = self._get_output_parser()

        self._chain = prompt_template | model | output_parser

    def _get_prompt_template(self) -> runnables.Runnable:
        return ChatPromptTemplate.from_messages([
            ('system',
             '''
                You are an assistant tasked with classifying whether the given publication title
                is associated with the given research topic.

                Specifically, the content should be marked as relevant if it involves:
                    1. Publications which are likely to have been written based on the research topic as a prompt.
                    2. If the publication title has overlap with the research topic.

                Generate a short response indicating whether the content meets any of the above criteria. Respond
                with "Yes" for relevance or "No" if the publication does not have high overlap.
             '''),
            ('human', '''
             Assess the given headline and article body based on the specified criteria. Provide a concise response indicating relevance.

Publication Title: {publication_title}

Research Topic: {frp_title}
             ''')
        ])

    def _get_model(self) -> runnables.Runnable:
        return Ollama(base_url='https://ollama-sail-24887a.apps.shift.nerc.mghpcc.org', model='llama2:13b')

    def _get_output_parser(self) -> runnables.Runnable:
        return BooleanOutputParser()

    def match(self, mapping: dict[str, str]) -> Union[bool, NAType]:
        """
        Handles running the matching logic against a specific
        prompt. The mapping is between specific identifiers
        and their coorespoding value. For example

        .. code-block:: python
           mapping = {
               'publication_title': 'Title example',
               'abstract': 'Abstract example'
           }
        """
        try:
            return self._chain.invoke(mapping)
        except Exception as e:
            print(e)
        return True
