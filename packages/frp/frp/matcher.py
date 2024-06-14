from langchain_core import runnables
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


class Match:
    def __init__(self):
        prompt_template = self._get_prompt_template()
        model = self._get_model()
        output_parser = self._get_output_parser()

        self.chain = prompt_template | model | output_parser

    def _get_prompt_template(self) -> runnables.Runnable:
        return ChatPromptTemplate.from_messages([

        ])

    def _get_model(self) -> runnables.Runnable:
        return Ollama(model='llama2')

    def _get_output_parser(self) -> runnables.Runnable:
        return StrOutputParser()

    def match(self, mapping: dict[str, str]) -> bool:
        """
        Handles running the matching logic against a specific
        prompt. The mapping is between specific identifiers
        and their coorespoding value. For example

        .. code-block:: python
           mapping = {
               'title': 'Title example',
               'abstract': 'Abstract example'
           }
        """
        return True

