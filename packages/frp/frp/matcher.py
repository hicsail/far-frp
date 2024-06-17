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
    def __init__(self, config: dict):
        # Pull out the needed configs
        system_prompt = config['system_prompt']
        human_prompt = config['human_prompt']
        model_name = config['model_name']
        model_base_url = config['model_base_url']

        # Build up the LangChain chain for handling the matching
        prompt_template = self._get_prompt_template(system_prompt, human_prompt)
        model = self._get_model(model_base_url, model_name)
        output_parser = self._get_output_parser()

        self._chain = prompt_template | model | output_parser

    def _get_prompt_template(self, system_prompt: str, human_prompt: str) -> runnables.Runnable:
        return ChatPromptTemplate.from_messages([
            ('system', system_prompt),
            ('human', human_prompt)
        ])

    def _get_model(self, base_url: str, model_name: str) -> runnables.Runnable:
        return Ollama(base_url=base_url, model=model_name)

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
